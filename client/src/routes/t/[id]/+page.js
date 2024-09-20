import { apiCall } from '$lib/api.js';

export async function load({ fetch, params }) {
    const topic = await apiCall({ fetch }, "getTopic", { id: params.id })
    return {
        topic
    }
}