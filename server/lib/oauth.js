const oauthClient = new NodeOAuthClientOptions({
    clientMetadata: {
        client_id: 'https://my-app.com/client-metadata.json',
        client_name: 'My App',
        client_uri: 'https://my-app.com',
        logo_uri: 'https://my-app.com/logo.png',
        tos_uri: 'https://my-app.com/tos',
        policy_uri: 'https://my-app.com/policy',
        redirect_uris: ['https://my-app.com/callback'],
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        application_type: 'web',
        token_endpoint_auth_method: 'private_key_jwt',
        dpop_bound_access_tokens: true,
        jwks_uri: 'https://my-app.com/jwks.json',
    },
    /*keyset: await Promise.all([
        JoseKey.fromImportable(process.env.PRIVATE_KEY_1),
        JoseKey.fromImportable(process.env.PRIVATE_KEY_2),
        JoseKey.fromImportable(process.env.PRIVATE_KEY_3),
    ]),*/

    // Interface to store authorization state data (during authorization flows)
    /* stateStore: {
        set(key: string, internalState: NodeSavedState): Promise<void> { },
        get(key: string): Promise<NodeSavedState | undefined> { },
        del(key: string): Promise<void> { },
    },

    // Interface to store authenticated session data
    sessionStore: {
        set(sub: string, session: Session): Promise<void> { },
        get(sub: string): Promise<Session | undefined> { },
        del(sub: string): Promise<void> { },
    },

    // A lock to prevent concurrent access to the session store. Optional if only one instance is running.
    requestLock,*/
})
