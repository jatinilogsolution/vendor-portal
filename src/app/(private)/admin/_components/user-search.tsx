'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
 

export function UserSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialName = searchParams.get('name') || '';

    const [name, setName] = useState(initialName);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (name) {
                params.set('name', name);
            } else {
                params.delete('name');
            }
            params.delete('page');
            router.replace(`?${params.toString()}`);
        }, 500);

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    return (
        <div>

            <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Search by name..."
                className="  rounded w-full min-w-md max-w-lg  "
            />

        </div>

    );
}
