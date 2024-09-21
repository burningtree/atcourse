
export async function apiCall({ fetch }, endpoint, params = null) {
    const resp = await fetch("/api/1/" + endpoint + (params ? '?' + new URLSearchParams(params) : ''))
    return resp.json()
}

export async function apiCallPost({ fetch }, endpoint, data = {}) {
    const resp = await fetch("/api/1/" + endpoint, { method: "post", body: JSON.stringify(data), headers: { 'content-type': 'application/json' } })
    return resp.json()
}