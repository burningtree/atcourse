import { apiCall } from '$lib/api.js';

export async function load({ fetch, params }) {
    const topic = await apiCall({ fetch }, "com.atpbb.forum.getTopic", { id: params.id })
    return {
        topic
    }
}