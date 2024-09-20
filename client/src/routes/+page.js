import { apiCall } from '$lib/api.js';

export async function load({ fetch, parent }) {
    const data = await parent()
    const topics = await apiCall({ fetch }, "listTopics")
    return {
        ...data,
        topics
    }
}