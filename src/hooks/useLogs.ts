import useSWR from "swr";
import { useState, useCallback } from "react";

export interface LogFilters {
    q?: string;
    model?: string;
    action?: string;
    userId?: string;
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
}

export interface LogEntry {
    id: string;
    createdAt: string;
    userId: string | null;
    vendorId: string | null;
    action: string;
    model: string;
    recordId: string | null;
    oldData: any;
    newData: any;
    description: string | null;
    user: {
        id: string;
        name: string | null;
        email: string | null;
    } | null;
}

export interface LogsResponse {
    total: number;
    page: number;
    pageSize: number;
    data: LogEntry[];
}

const fetcher = async (url: string): Promise<LogsResponse> => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch logs");
    }
    return res.json();
};

/**
 * Hook for fetching logs with filtering and pagination
 */
export function useLogs(initialFilters: LogFilters = {}) {
    const [filters, setFilters] = useState<LogFilters>(initialFilters);

    // Build query string from filters
    const buildQueryString = useCallback((f: LogFilters) => {
        const params = new URLSearchParams();
        Object.entries(f).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.set(key, String(value));
            }
        });
        return params.toString();
    }, []);

    const queryString = buildQueryString(filters);
    const url = `/api/logs${queryString ? `?${queryString}` : ""}`;

    const { data, error, isLoading, mutate } = useSWR<LogsResponse>(url, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 5000,
    });

    const updateFilters = useCallback((newFilters: Partial<LogFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({});
    }, []);

    const refresh = useCallback(() => {
        mutate();
    }, [mutate]);

    return {
        logs: data?.data || [],
        total: data?.total || 0,
        page: data?.page || 1,
        pageSize: data?.pageSize || 25,
        isLoading,
        error,
        filters,
        updateFilters,
        resetFilters,
        refresh,
    };
}

/**
 * Hook for fetching log statistics
 */
export function useLogStats() {
    const statsFetcher = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error("Failed to fetch stats");
        }
        return res.json();
    };

    const { data, error, isLoading } = useSWR<{
        totalLogs: number;
        byAction: Record<string, number>;
        byModel: Record<string, number>;
        recentActivity: Array<{ date: string; count: number }>;
    }>("/api/logs/stats", statsFetcher, {
        revalidateOnFocus: false,
        refreshInterval: 30000, // Refresh every 30 seconds
    });

    return {
        stats: data,
        isLoading,
        error,
    };
}

/**
 * Hook for fetching logs for a specific record
 */
export function useRecordLogs(model: string, recordId: string) {
    const { data, error, isLoading, mutate } = useSWR<LogsResponse>(
        model && recordId ? `/api/logs?model=${model}&recordId=${recordId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        logs: data?.data || [],
        total: data?.total || 0,
        isLoading,
        error,
        refresh: mutate,
    };
}

/**
 * Hook for fetching logs for a specific user
 */
export function useUserLogs(userId: string) {
    const { data, error, isLoading, mutate } = useSWR<LogsResponse>(
        userId ? `/api/logs?userId=${userId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        logs: data?.data || [],
        total: data?.total || 0,
        isLoading,
        error,
        refresh: mutate,
    };
}
