import { apiCall } from '$lib/api.js';

export async function load({ fetch }) {
    const topics = await apiCall({ fetch }, "com.atpbb.forum.listTopics")
    return {
        topics
    }
}