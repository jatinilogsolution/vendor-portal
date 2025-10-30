 
export type DocEntry = {
    id: string;
    name: string;
    url: string;
    uploadedBy?: string;
    uploadedAt?: string;
    type?: string;
};

export function parseDocsField(field?: string | null): DocEntry[] {
    if (!field) return [];
    try {
        const parsed = JSON.parse(field);
        if (Array.isArray(parsed)) return parsed;
        return [];
    } catch (e: any) {
        console.log("Error in parsing file: ", e)
        return [];
    }
}

export function stringifyDocsField(entries: DocEntry[]) {
    return JSON.stringify(entries);
}

export function addDocEntry(field?: string | null, entry?: DocEntry) {
    const arr = parseDocsField(field);
    if (entry) arr.push(entry);
    return stringifyDocsField(arr);
}
