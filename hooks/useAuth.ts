// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useJellyfinStore } from '@/store/jellyfinStore';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    const { api, restoreSession } = useJellyfinStore();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await restoreSession();
            } catch {
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [restoreSession, router]);

    return { api, loading };
};
