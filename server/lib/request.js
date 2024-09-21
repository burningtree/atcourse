import { getIronSession } from "iron-session"
import { Agent } from "@atproto/api"

export async function responder(instances, callback) {

    return async (request, response) => {

        const instance = instances.getInstanceFromRequest(request)

        const ctx = {
            instance,
            ...instance.db.getContext()
        }
        ctx.clientSession = await getIronSession(request, response, {
            cookieName: 'sid',
            password: instance.cookieSecret,
        })
        if (ctx.clientSession && ctx.clientSession.did) {
            try {
                ctx.oauthSession = await instance.oauthClient.restore(ctx.clientSession.did)
            } catch (e) {
                console.error(`cannot restore session: ${e}`)
            }
            if (ctx.oauthSession) {
                ctx.agent = new Agent(ctx.oauthSession)
            }
        }
        const data = typeof request.json === "function" ? await request.json() : (request.json || request.body)
        let resp;
        try {
            resp = await callback({ request, ctx, params: request.query_parameters || request.query || {}, data })
        } catch (e) {
            resp = {
                error: e.message
            }
        }

        response.setHeader('vary', 'Origin')
        response.setHeader("Content-Type", "application/json");

        response.end(JSON.stringify(resp))
    }
}