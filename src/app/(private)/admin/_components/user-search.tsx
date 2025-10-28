'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
 import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Search } from 'lucide-react';
 

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

        

     
        <InputGroup>
            <InputGroupInput placeholder="Search by name..."

                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">{ } results</InputGroupAddon>
        </InputGroup>


    );
}
