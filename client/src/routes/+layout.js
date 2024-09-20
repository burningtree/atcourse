import { apiCall } from '$lib/api.js';

export async function load({ fetch }) {

    const [instance, session] = await Promise.all([
        await apiCall({ fetch }, 'instance'),
        await apiCall({ fetch }, 'session')
    ])
    return {
        session: !session.error ? session : null,
        instance
    }
}