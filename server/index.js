import 'dotenv/config'

import express from "express"
import bodyParser from 'body-parser'
import { getIronSession } from 'iron-session';
import { TID } from '@atproto/common'

import { loadYaml } from './lib/utils.js';
import { InstanceManager } from './lib/instance.js';
import { responder } from './lib/request.js';

import pkg from '../package.json' assert { type: "json" };

import { handler as clientHandler } from '../client/build/handler.js';

// load config file
const config = loadYaml('../config.yaml');

console.log('Starting atcourse server ...')

// initialize instances
const instances = new InstanceManager()
try {
    await instances.init(config.instances)
} catch (e) {
    console.error(e)
    throw e
}
const instanceResponder = (...args) => responder(instances, ...args)

//const server = new HyperExpress.Server();
const server = express();
server.use(bodyParser.json())


server.get('/api/1/listTopics', await instanceResponder(async ({ ctx }) => {
    const topics = await ctx.topic.find({}, { orderBy: { createdAt: 'desc' } })
    return Promise.all(topics.map(t => t.view(ctx)))
}))

server.get('/api/1/getTopic', await instanceResponder(async ({ ctx, params }) => {
    if (!params.id) {
        throw new Error('Need ID')
    }
    const topic = await ctx.topic.findOne({ id: params.id })
    if (!topic) {
        throw new Error('Topic not found')
    }
    return topic.view(ctx, { text: true, replies: true })
}))

server.post('/api/1/createReply', await instanceResponder(async ({ ctx, data }) => {

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
            instance: ctx.instance.did,
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

server.post('/api/1/createTopic', await instanceResponder(async ({ ctx, data }) => {

    if (!ctx.oauthSession) {
        throw new Error('Not logged in')
    }

    const { title, text } = data;
    if (!title) {
        throw new Error('Title is required')
    }
    if (!text) {
        throw new Error('Text is required')
    }

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
            instance: ctx.instance.did,
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

server.post('/api/1/deleteReply', await instanceResponder(async ({ ctx, data }) => {

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

server.post('/api/1/deleteTopic', await instanceResponder(async ({ ctx, data }) => {

    if (!ctx.oauthSession) {
        throw new Error('Not logged in')
    }
    const { id } = data

    if (!id) {
        throw new Error('No topic id')
    }

    const topic = await ctx.topic.findOne({ id: reply.topicId })
    if (!topic) {
        throw new Error('Topic not found')
    }
    if (topic.authorDid !== ctx.clientSession.did) {
        throw new Error('Permission denied')
    }

    // remove from repo
    await ctx.agent.com.atproto.repo.deleteRecord({
        repo: ctx.agent.assertDid,
        collection: 'app.atpbb.forum.topic',
        rkey: topic.rkey,
    })

    // remove from db
    await ctx.em.remove(topic).flush()

    return {
        ok: true,
        url: '/'
    }
}))

server.get('/api/1/instance', await instanceResponder(async ({ ctx: { instance } }) => {

    async function resolveActors(arr = []) {
        return Promise.all(arr.map(async (actor) => {
            const user = await instance.agent.getProfile({ actor })
            return user?.data
        }))
    }

    const out = {
        did: instance.did,
        publicUrl: instance.publicUrl,
        name: instance.configRecord.name || instance.host,
        version: pkg.version,
        record: instance.configRecord,
        admins: await resolveActors(instance.configRecord.admins),
        moderators: await resolveActors(instance.configRecord.moderators)
    }
    return out
}))

server.get('/api/1/session', await instanceResponder(async ({ ctx }) => {
    if (!ctx.oauthSession) {
        return { error: 'not logged in' }
    }
    const profileResult = await ctx.agent.getProfile({ actor: ctx.agent.assertDid })
    return { did: ctx.clientSession.did, profile: profileResult.data }
}))

server.post('/api/1/login', await instanceResponder(async ({ ctx, params, data }) => {
    if (!data.handle) {
        throw new Error('Handle not found')
    }
    const url = await ctx.instance.oauthClient.authorize(data.handle, {
        scope: 'atproto transition:generic',
    })
    return { url }
}))

server.get('/oauth/callback', async (req, res) => {
    const instance = instances.getInstanceFromRequest(req)
    const params = new URLSearchParams(req.url.split('?')[1])
    try {
        const { session } = await instance.oauthClient.callback(params)
        const clientSession = await getIronSession(req, res, {
            cookieName: 'sid',
            password: instance.cookieSecret,
        })
        clientSession.did = session.did
        await clientSession.save()

    } catch (err) {
        console.error(err)
    }
    return res.redirect(instance.publicUrl)
})

server.get('/oauth/client-metadata.json', async (request, response) => {
    const instance = instances.getInstanceFromRequest(request)
    response.setHeader("Content-Type", "application/json")
    response.end(JSON.stringify(instance.oauthClient.clientMetadata))
})

server.get('/oauth/jwks.json', async (request, response) => {
    const instance = instances.getInstanceFromRequest(request)
    response.setHeader("Content-Type", "application/json")
    response.end(JSON.stringify(instance.oauthClient.jwks))
})

server.get('/api/1/status', async (request, response) => {
    response.end('ok')
})

const masterServer = express()
masterServer.use(server)

if (process.env.NODE_ENV === "production") {
    // add client data
    masterServer.use(clientHandler)
    console.log("@atcourse/client server enabled")
}

console.log('starting webserver ..')
const port = config.listen?.port || process.env.ATCOURSE_PORT || 6855
await masterServer.listen(port)

console.log(`Server started on port ${port}`)

process.on('SIGTERM', () => {
    console.log('Shutting down ..')
    instances.close()
});