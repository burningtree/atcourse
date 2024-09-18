import HyperExpress from "hyper-express"
import { initDatabase } from "./lib/db.js";
import { loadMockData } from "./lib/mock.js";
import { AtpAgent } from '@atproto/api'

//import { NodeOAuthClientOptions } from '@atproto/oauth-client-node'
//import OAuthClient from '@atproto/oauth-client-node';
import pkg from '@atproto/oauth-client-node';
const { NodeOAuthClientOptions } = pkg;

//console.log(pkg, pkg.NodeOAuthClientOptions)
const agent = new AtpAgent({ service: 'https://public.api.bsky.app' })

const PORT = 6855
const api = {
    env: 'development',
    agent,
}

api.db = await initDatabase(api);
await loadMockData(api);

function responder(callback) {
    const ctx = api.db.getContext()
    return async (request, response) => {
        const resp = await callback({ request, ctx, params: request.query_parameters || {} })

        response.setHeader('vary', 'Origin')
        response.setHeader('Access-Control-Allow-Origin', '*')
        response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        response.setHeader("Content-Type", "application/json");
        response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE')
        response.setHeader('Access-Control-Allow-Credentials', "true")
        response.send(JSON.stringify(resp))
    }
}

const server = new HyperExpress.Server();

server.get('/xrpc/com.atpbb.forum.listTopics', responder(async ({ ctx }) => {
    const topics = await ctx.topic.find({})
    return Promise.all(topics.map(t => t.view(ctx)))
}))

server.get('/xrpc/com.atpbb.forum.getTopic', responder(async ({ ctx, params }) => {
    if (!params.id) {
        throw new Error('Need ID')
    }
    const topic = await ctx.topic.findOne({ id: params.id })
    if (!topic) {
        throw new Error('Topic not found')
    }
    return topic.view(ctx, { text: true, replies: true })
}))


server.listen(PORT)
    .then((socket) => console.log(`Webserver started on port ${PORT}`))
    .catch((error) => console.log(`Failed to start webserver on port ${PORT}`));

process.on('SIGTERM', () => {
    api.db.orm.close()
});