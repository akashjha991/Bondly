import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    // We try to get session token via GET request to internal /api/auth/session or client getSession
    const session = await getSession();

    // As a workaround for server components which can't use getSession directly easily in the same file as client,
    // we assume fetchWithAuth is mostly called from Client Components. If server, they should pass headers.

    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (session?.user?.id) {
        // Send user ID directly for trusted local server (fallback for testing)
        headers.set('X-User-Id', session.user.id);
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    return response;
}
