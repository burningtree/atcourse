import { NodeOAuthClient } from '@atproto/oauth-client-node'
import { JoseKey } from '@atproto/jwk-jose'
//import { SessionStore, StateStore } from './storage'

export const createOAuthClient = async (instance) => {

    const publicUrl = instance.publicUrl
    const url = publicUrl || `http://127.0.0.1:${env.PORT}`

    const em = instance.db.em.fork()
    const AuthSession = em.getRepository('AuthSession')
    const AuthState = em.getRepository('AuthState')

    return new NodeOAuthClient({
        clientMetadata: {
            client_name: `atcourse instance [${instance.did}]`,
            client_id: publicUrl
                ? `${url}/oauth/client-metadata.json`
                : `http://localhost?redirect_uri=${encodeURIComponent(`${url}/oauth/callback`)}`,
            client_uri: url,
            subject_type: "public",
            redirect_uris: [`${url}/oauth/callback`],
            scope: 'atproto transition:generic',
            grant_types: ['authorization_code', 'refresh_token'],
            response_types: ['code'],
            application_type: 'web',
            //token_endpoint_auth_method: 'none',
            token_endpoint_auth_method: 'private_key_jwt',
            token_endpoint_auth_signing_alg: "RS256",
            dpop_bound_access_tokens: true,
            jwks_uri: `${url}/oauth/jwks.json`,
            /*logo_uri: `${url}/logo.png`,
            tos_uri: `${url}/terms`,
            policy_uri: `${url}/policy`,*/
        },
        keyset: await Promise.all(instance.jwksPrivateKeys.map(k => JoseKey.fromImportable(k))),
        stateStore: {
            async set(key, state) {
                const item = em.create("AuthState", { key, state })
                await em.persist(item).flush()
            },
            async get(key) {
                const result = await AuthState.findOne({ key })
                if (!result) return
                return result.state
            },
            async del(key) {
                const result = await AuthState.findOne({ key })
                if (!result) return
                await em.remove(result).flush()
            },
        },
        sessionStore: {
            async set(key, session) {
                const item = em.create("AuthSession", { key, session })
                await em.persist(item).flush()
            },
            async get(key) {
                const result = await AuthSession.findOne({ key })
                if (!result) return
                return result.session
            },
            async del(key) {
                const result = await AuthSession.findOne({ key })
                if (!result) return
                await em.remove(result).flush()
            },
        },
    })
}