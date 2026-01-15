"use server";

import { prisma } from "@/lib/prisma";
import { auditCreate, auditUpdate, auditDelete } from "@/lib/audit-logger";

/**
 * Test function to create sample audit logs
 * This helps verify the logging system is working
 */
export async function createTestLogs() {
    try {
        console.log("Creating test audit logs...");

        // Test 1: Create log
        await auditCreate(
            "Invoice",
            {
                refernceNumber: "TEST-INV-001",
                amount: 10000,
                status: "DRAFT",
            },
            "Test invoice creation",
            "test-invoice-001"
        );
        console.log("✅ Created test CREATE log");

        // Test 2: Update log  
        await auditUpdate(
            "LRRequest",
            "test-lr-001",
            { status: "PENDING", price: 5000 },
            { status: "APPROVED", price: 5500 },
            "Test LR status and price update"
        );
        console.log("✅ Created test UPDATE log");

        // Test 3: Delete log
        await auditDelete(
            "Document",
            "test-doc-001",
            { name: "test.pdf", url: "https://example.com/test.pdf" },
            "Test document deletion"
        );
        console.log("✅ Created test DELETE log");

        // Test 4: Another create
        await auditCreate(
            "User",
            {
                name: "Test User",
                email: "test@example.com",
                role: "VENDOR",
            },
            "Test user registration",
            "test-user-001"
        );
        console.log("✅ Created test User CREATE log");

        // Test 5: Vendor update
        await auditUpdate(
            "Vendor",
            "test-vendor-001",
            { name: "Old Vendor Name", gstNumber: "OLD123456789" },
            { name: "New Vendor Name", gstNumber: "NEW987654321" },
            "Test vendor profile update"
        );
        console.log("✅ Created test Vendor UPDATE log");

        return { success: true, message: "Created 5 test audit logs successfully" };
    } catch (error) {
        console.error("Failed to create test logs:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error"
        };
    }
}

/**
 * Test creating a single log entry
 */
export async function createSingleTestLog(
    action: "CREATE" | "UPDATE" | "DELETE",
    model: string,
    description: string
) {
    try {
        if (action === "CREATE") {
            await auditCreate(model, { test: true }, description, `test-${Date.now()}`);
        } else if (action === "UPDATE") {
            await auditUpdate(
                model,
                `test-${Date.now()}`,
                { old: "value" },
                { new: "value" },
                description
            );
        } else {
            await auditDelete(model, `test-${Date.now()}`, { deleted: true }, description);
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to create test log:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Clear all test logs (those with recordId starting with "test-")
 */
export async function clearTestLogs() {
    try {
        const result = await prisma.log.deleteMany({
            where: {
                recordId: {
                    startsWith: "test-",
                },
            },
        });

        return {
            success: true,
            message: `Cleared ${result.count} test logs`,
            count: result.count,
        };
    } catch (error) {
        console.error("Failed to clear test logs:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
