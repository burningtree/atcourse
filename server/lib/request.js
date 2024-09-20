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
            //console.log(oauthSession)
        }

        const data = await request.json()
        const resp = await callback({ request, ctx, params: request.query_parameters || {}, data })

        response.setHeader('vary', 'Origin')
        response.setHeader("Content-Type", "application/json");

        /*response.setHeader('Access-Control-Allow-Origin', '*')
        response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE')
        response.setHeader('Access-Control-Allow-Credentials', "true")*/
        response.send(JSON.stringify(resp))
    }
}