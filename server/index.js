import 'dotenv/config'

import HyperExpress from "hyper-express"
import { initDatabase } from "./lib/db.js";
import { Agent, AtpAgent } from '@atproto/api'
import { TID } from '@atproto/common'
import { createClient } from "./lib/oauth.js";
import { getIronSession } from 'iron-session';

const instanceDid = process.env.INSTANCE_ACCOUNT_DID

const instanceAgent = new AtpAgent({ service: process.env.INSTANCE_ACCOUNT_PDS })
await instanceAgent.login({
    identifier: instanceDid,
    password: process.env.INSTANCE_ACCOUNT_PASSWORD,
})

const rec = await instanceAgent.com.atproto.repo.putRecord({
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
})

const instanceConfigRecord = await instanceAgent.com.atproto.repo.getRecord({
    repo: instanceDid,
    collection: 'app.atpbb.forum.instance',
    rkey: 'self',
})
const instanceConfig = instanceConfigRecord ? instanceConfigRecord.data.value : {}

const agent = new AtpAgent({ service: 'https://public.api.bsky.app' })

const PORT = 6855
const api = {
    env: 'development',
    agent,
}

api.db = await initDatabase(api);

const client = await createClient(api.db)

async function responder(callback) {

    return async (request, response) => {

        const ctx = api.db.getContext()
        ctx.clientSession = await getIronSession(request, response, {
            cookieName: 'sid',
            password: process.env.COOKIE_SECRET,
        })
        if (ctx.clientSession && ctx.clientSession.did) {
            try {
                ctx.oauthSession = await client.restore(ctx.clientSession.did)
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

const server = new HyperExpress.Server();

server.get('/api/1/listTopics', await responder(async ({ ctx }) => {
    const topics = await ctx.topic.find({}, { orderBy: { createdAt: 'desc' } })
    return Promise.all(topics.map(t => t.view(ctx)))
}))

server.get('/api/1/getTopic', await responder(async ({ ctx, params }) => {
    if (!params.id) {
        throw new Error('Need ID')
    }
    const topic = await ctx.topic.findOne({ id: params.id })
    if (!topic) {
        throw new Error('Topic not found')
    }
    return topic.view(ctx, { text: true, replies: true })
}))

server.post('/api/1/createReply', await responder(async ({ ctx, data }) => {

    if (!ctx.oauthSession) {
        throw new Error('Not logged in')
    }

    const { text, topic: topicId } = data;

    const topic = await ctx.topic.findOne({ id: topicId })
    if (!topic) {
        throw new Error('Topic not exists')
    }
    const createdAt = new Date().toISOString()

    const rkey = TID.nextStr()
    const rec = await ctx.agent.com.atproto.repo.putRecord({
        repo: ctx.agent.assertDid,
        collection: 'app.atpbb.forum.reply',
        rkey,
        record: {
            instance: instanceDid,
            topic: topic.recordUri(),
            text,
            createdAt,
        }
    })

    const reply = ctx.reply.create({
        topicId: topic.id,
        text,
        authorDid: ctx.clientSession.did,
        rkey,
        createdAt,
        lastActivity: createdAt
    })

    await ctx.em.persist(reply).flush()
    return reply.view(ctx)
}))

server.post('/api/1/createTopic', await responder(async ({ ctx, data }) => {

    if (!ctx.oauthSession) {
        throw new Error('Not logged in')
    }

    const { title, text } = data;
    const createdAt = new Date().toISOString()

    /*await ctx.agent.com.atproto.repo.deleteRecord({
        repo: ctx.agent.assertDid,
        collection: 'app.atpbb.forum.topic',
        rkey: 'self',
    })*/

    const rkey = TID.nextStr()
    const rec = await ctx.agent.com.atproto.repo.putRecord({
        repo: ctx.agent.assertDid,
        collection: 'app.atpbb.forum.topic',
        rkey,
        record: {
            instance: instanceDid,
            title,
            text,
            createdAt,
        }
    })

    const topic = ctx.topic.create({
        title,
        text,
        authorDid: ctx.clientSession.did,
        rkey,
        createdAt,
        lastActivity: createdAt
    })

    await ctx.em.persist(topic).flush()
    return topic.view(ctx)
}))

server.post('/api/1/deleteReply', await responder(async ({ ctx, data }) => {

    if (!ctx.oauthSession) {
        throw new Error('Not logged in')
    }
    const { id } = data

    if (!id) {
        throw new Error('No reply id')
    }

    const reply = await ctx.reply.findOne({ id })
    if (!reply) {
        throw new Error('Reply not found')
    }
    const topic = await ctx.topic.findOne({ id: reply.topicId })
    if (!topic) {
        throw new Error('Topic not found')
    }
    if (reply.authorDid !== ctx.clientSession.did) {
        throw new Error('Permission denied')
    }

    // remove from repo
    await ctx.agent.com.atproto.repo.deleteRecord({
        repo: ctx.agent.assertDid,
        collection: 'app.atpbb.forum.reply',
        rkey: reply.rkey,
    })

    // remove from db
    await ctx.em.remove(reply).flush()

    return {
        ok: true,
        url: topic.url()
    }
}))


server.get('/api/1/instance', await responder(async ({ ctx }) => {
    const config = { ...instanceConfig }

    config.admins = await Promise.all(config.admins.map(async (actor) => {
        const user = await ctx.api.agent.getProfile({ actor })
        return user?.data
    }))

    config.moderators = await Promise.all(config.moderators.map(async (actor) => {
        const user = await ctx.api.agent.getProfile({ actor })
        return user?.data
    }))

    return config
}))

server.get('/api/1/session', await responder(async ({ ctx }) => {
    if (!ctx.oauthSession) {
        return { error: 'not logged in' }
    }
    const profileResult = await ctx.agent.getProfile({ actor: ctx.agent.assertDid })
    return { did: ctx.clientSession.did, profile: profileResult.data }
}))

server.post('/api/1/login', await responder(async ({ ctx, params, data }) => {
    if (!data.handle) {
        throw new Error('Handle not found')
    }
    const url = await client.authorize(data.handle, {
        scope: 'atproto transition:generic',
    })
    return { url }
}))

server.get('/oauth/callback', async (req, res) => {

    const params = new URLSearchParams(req.url.split('?')[1])
    try {
        const { session } = await client.callback(params)
        const clientSession = await getIronSession(req, res, {
            cookieName: 'sid',
            password: process.env.COOKIE_SECRET,
        })
        clientSession.did = session.did
        await clientSession.save()

    } catch (err) {
        console.error(err)
    }
    return res.redirect("https://forum.atscan.net")
    //res.send(JSON.stringify({ params, pars: req.url.split('?')[1] }))
})

server.get('/oauth/client-metadata.json', async (request, response) => {
    response.setHeader("Content-Type", "application/json");
    response.send(JSON.stringify(client.clientMetadata))
})

server.get('/oauth/jwks.json', async (request, response) => {
    response.setHeader("Content-Type", "application/json");
    response.send(JSON.stringify(client.jwks))
})

server.listen(PORT)
    .then((socket) => console.log(`Webserver started on port ${PORT}`))
    .catch((error) => console.log(`Failed to start webserver on port ${PORT}`));

process.on('SIGTERM', () => {
    api.db.orm.close()
});