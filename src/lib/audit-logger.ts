import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * Supported audit actions
 */
export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "IMPORT" | "EXPORT" | "APPROVE" | "REJECT";

/**
 * Model names in the system
 */
export type AuditModel =
    | "Invoice"
    | "LRRequest"
    | "PurchaseOrder"
    | "Vendor"
    | "User"
    | "Document"
    | "Annexure"
    | "AnnexureFileGroup"
    | "ExtraCost"
    | "LorryReceipt"
    | string; // Allow custom model names

/**
 * Options for creating an audit log
 */
export interface AuditLogOptions {
    action: AuditAction;
    model: AuditModel;
    recordId?: string | null;
    oldData?: any;
    newData?: any;
    description?: string;
    userId?: string | null;
    vendorId?: string | null;
    metadata?: Record<string, any>; // Additional context/metadata
}

/**
 * Captured request context
 */
interface RequestContext {
    userId?: string;
    vendorId?: string;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
}

/**
 * Sanitize sensitive data from objects
 */
function sanitizeData(data: any): any {
    if (!data) return data;

    const sensitiveFields = [
        'password',
        'passwordHash',
        'accessToken',
        'refreshToken',
        'idToken',
        'secret',
        'apiKey',
        'privateKey'
    ];

    if (typeof data !== 'object') return data;

    const sanitized = Array.isArray(data) ? [...data] : { ...data };

    for (const key in sanitized) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
            sanitized[key] = '[REDACTED]';
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeData(sanitized[key]);
        }
    }

    return sanitized;
}

/**
 * Capture current request context (user, session, IP, etc.)
 */
async function captureRequestContext(): Promise<RequestContext> {
    const context: RequestContext = {};

    try {
        // Capture request headers first
        const headersList = await headers();

        // Get current session WITHOUT redirecting - use Better Auth's API directly
        try {
            const { auth } = await import("@/lib/auth");
            const session = await auth.api.getSession({ headers: headersList });
            if (session?.user) {
                context.userId = (session.user as any).id;
                context.vendorId = (session.user as any).vendorId;
                context.sessionId = (session as any).sessionId || (session as any).id;
            }
        } catch (sessionErr) {
            // Session might not exist, that's ok - log will be created without user info
            console.debug('No session found for audit log');
        }

        // Capture IP and user agent
        try {
            context.ipAddress =
                headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                headersList.get('x-real-ip') ||
                headersList.get('cf-connecting-ip') ||
                'unknown';
            context.userAgent = headersList.get('user-agent') || 'unknown';
        } catch (err) {
            // headers() might fail in some contexts
            console.debug('Could not capture headers:', err);
        }
    } catch (err) {
        console.debug('Could not capture request context:', err);
    }

    return context;
}

/**
 * Calculate location in code where audit was called
 * This uses stack traces to determine the calling function
 */
function captureCallerLocation(): string {
    try {
        const stack = new Error().stack;
        if (!stack) return 'unknown';

        const lines = stack.split('\n');
        // Skip first 3 lines (Error, this function, auditLog function)
        const callerLine = lines[3] || lines[2] || '';

        // Extract file path and line number
        const match = callerLine.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
        if (match) {
            const [, funcName, filePath, lineNum] = match;
            // Extract just filename from full path
            const fileName = filePath.split('/').pop() || filePath;
            return `${funcName} (${fileName}:${lineNum})`;
        }

        // Alternative format
        const simpleMatch = callerLine.match(/at\s+(.+?):(\d+):(\d+)/);
        if (simpleMatch) {
            const [, filePath, lineNum] = simpleMatch;
            const fileName = filePath.split('/').pop() || filePath;
            return `${fileName}:${lineNum}`;
        }

        return callerLine.trim().replace('at ', '') || 'unknown';
    } catch (err) {
        return 'unknown';
    }
}

/**
 * Main audit logging function
 * Creates a log entry in the database with all context
 */
export async function auditLog(options: AuditLogOptions): Promise<void> {
    try {
        // Capture context
        const context = await captureRequestContext();
        const location = captureCallerLocation();

        // Merge provided userId/vendorId with context (provided takes precedence)
        const userId = options.userId ?? context.userId ?? null;
        const vendorId = options.vendorId ?? context.vendorId ?? null;

        // Sanitize data to remove sensitive information
        const sanitizedOldData = sanitizeData(options.oldData);
        const sanitizedNewData = sanitizeData(options.newData);

        // Build enriched description
        let description = options.description || '';
        if (location && location !== 'unknown') {
            description = description
                ? `${description} [${location}]`
                : `[${location}]`;
        }

        // Create metadata object
        const metadata = {
            ...options.metadata,
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            sessionId: context.sessionId,
            timestamp: new Date().toISOString(),
        };

        // Create log entry
        await prisma.log.create({
            data: {
                userId,
                vendorId,
                action: options.action,
                model: options.model,
                recordId: options.recordId ?? null,
                oldData: sanitizedOldData ? JSON.stringify(sanitizedOldData) : null,
                newData: sanitizedNewData ? JSON.stringify(sanitizedNewData) : null,
                description: description || null,
            },
        });

        console.log(`✅ Audit log created: ${options.action} ${options.model} ${options.recordId || ''}`);
    } catch (err) {
        // Log errors but don't throw - we don't want logging failures to break operations
        console.error('❌ Failed to create audit log:', err);
        console.error('Audit log options:', options);
    }
}

/**
 * Convenience function for logging CREATE operations
 */
export async function auditCreate(
    model: AuditModel,
    data: any,
    description?: string,
    recordId?: string
): Promise<void> {
    return auditLog({
        action: "CREATE",
        model,
        recordId,
        newData: data,
        description,
    });
}

/**
 * Convenience function for logging UPDATE operations
 */
export async function auditUpdate(
    model: AuditModel,
    recordId: string,
    oldData: any,
    newData: any,
    description?: string
): Promise<void> {
    return auditLog({
        action: "UPDATE",
        model,
        recordId,
        oldData,
        newData,
        description,
    });
}

/**
 * Convenience function for logging DELETE operations
 */
export async function auditDelete(
    model: AuditModel,
    recordId: string,
    oldData: any,
    description?: string
): Promise<void> {
    return auditLog({
        action: "DELETE",
        model,
        recordId,
        oldData,
        description,
    });
}

/**
 * Convenience function for logging IMPORT operations
 */
export async function auditImport(
    model: AuditModel,
    count: number,
    description?: string
): Promise<void> {
    return auditLog({
        action: "IMPORT",
        model,
        description: description || `Imported ${count} ${model} records`,
        metadata: { count },
    });
}

/**
 * Convenience function for logging authentication events
 */
export async function auditAuth(
    action: "LOGIN" | "LOGOUT",
    userId: string,
    description?: string
): Promise<void> {
    return auditLog({
        action,
        model: "User",
        recordId: userId,
        userId,
        description,
    });
}

/**
 * Convenience function for logging approval/rejection
 */
export async function auditApproval(
    model: AuditModel,
    recordId: string,
    approved: boolean,
    oldData?: any,
    newData?: any,
    description?: string
): Promise<void> {
    return auditLog({
        action: approved ? "APPROVE" : "REJECT",
        model,
        recordId,
        oldData,
        newData,
        description,
    });
}
