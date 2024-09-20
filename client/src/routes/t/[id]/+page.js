import { apiCall } from '$lib/api.js';

export async function load({ fetch, params }) {
    const idMatch = params.id.match(/^(\d+)/)
    if (!idMatch) {
        throw new Error('Invalid id')
    }
    const id = idMatch[1]
    const topic = await apiCall({ fetch }, "getTopic", { id })
    return {
        topic
    }
}