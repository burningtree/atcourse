import { Agent, AtpAgent } from '@atproto/api'
import { initDatabase } from './db.js'
import { createOAuthClient } from "./oauth.js";
import { responder } from './request.js';

export class InstanceManager {

    constructor() {
        this.instances = {}
    }

    async init(instancesConfig) {
        await Promise.all(instancesConfig.map(async instance => {
            instance.agent = new AtpAgent({ service: instance.account.pds })
            await instance.agent.login({
                identifier: instance.did,
                password: instance.account.password,
            })
            instance.host = new URL(instance.publicUrl).hostname
            // save to instances array
            this.instances[instance.did] = instance
            // load additional info about instance from pds
            instance.configRecord = await this.getConfigRecord(instance.did)
            // initialize database
            instance.db = await initDatabase(instance.did)
            // initialize oauth client
            instance.oauthClient = await createOAuthClient(instance)

            // done
            console.log(`* Instance "${instance.configRecord.name}": ${instance.publicUrl} [${instance.did}] initialized`)
        }))
        console.log(`instances initialized (${Object.keys(this.instances).length})`)
    }

    getInstance(did) {
        return this.instances[did]
    }

    getInstanceFromRequest(request) {
        for (const instanceId in this.instances) {
            if (this.instances[instanceId].host === request.headers.host) {
                return this.instances[instanceId]
            }
        }
        throw new Error('No instance found')
    }

    async getConfigRecord(did) {
        const instance = this.getInstance(did)
        let resp;
        try {
            resp = await instance.agent.com.atproto.repo.getRecord({
                repo: instance.did,
                collection: 'app.atpbb.forum.instance',
                rkey: 'self',
            })
        } catch (e) { }
        if (resp) {
            return resp.data.value
        }
        return {}
    }
}

/*const rec = await instanceAgent.com.atproto.repo.putRecord({
    repo: instanceDid,
    collection: 'app.atpbb.forum.instance',
    rkey: 'self',
    record: {
        name: "AT Protocol Research",
        description: "The AT Protocol Research Forum focuses on advancing the AT Protocol and Bluesky, exploring decentralized networking and user-owned data solutions.",
        categories: [
            {
                "id": "infrastructure",
                "color": "rgb(234 179 8)",
                "title": "Infrastructure",
                "description": "Topics improving AT Protocol infrastructure"
            },
            {
                "id": "apps",
                "color": "rgb(34 197 94)",
                "title": "Applications",
                "description": "Discussion about AT Protocol applications & use-cases"
            }
        ],
        admins: [
            "did:plc:524tuhdhh3m7li5gycdn6boe"
        ],
        moderators: [
            "did:plc:oio4hkxaop4ao4wz2pp3f4cr",
            "did:plc:44ybard66vv44zksje25o7dz",
        ],
    }
})*/