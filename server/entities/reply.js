import { EntitySchema, wrap } from "@mikro-orm/core";

export class Reply {

    url() {
        return process.env.INSTANCE_URL + '/t/' + this.topicId + '#' + this.id
    }

    recordUri() {
        return `at://${this.authorDid}/app.atpbb.forum.reply/${this.rkey}`
    }

    async view(ctx, opts = {}) {
        const r = wrap(this).toJSON();
        const json = {
            id: r.id,
            topicId: r.topicId,
            authorDid: r.authorDid,
            rkey: r.rkey,
            text: r.text,
            createdAt: r.createdAt,
        }

        // extend
        json.url = this.url()
        json.recordUri = this.recordUri()

        // authors
        const author = await ctx.api.agent.getProfile({ actor: r.authorDid })
        if (author) {
            json.author = author.data
        }
        return json
    }
}

export const schema = new EntitySchema({
    name: "Reply",
    class: Reply,
    properties: {
        id: {
            type: "int",
            primary: true,
            autoincrement: true,
        },
        topicId: {
            type: "int"
        },
        authorDid: {
            type: "string"
        },
        rkey: {
            type: "string",
            nullable: true
        },
        text: {
            type: "string"
        },
        createdAt: {
            type: "Date",
            onCreate: () => new Date(),
        }
    },
});