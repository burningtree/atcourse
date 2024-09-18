
export async function apiCall({ fetch }, method, params = null) {
    const resp = await fetch("http://localhost:6855/xrpc/" + method + (params ? '?' + new URLSearchParams(params) : ''))
    return resp.json()
}