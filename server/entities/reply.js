import { EntitySchema, wrap } from "@mikro-orm/core";

export class Reply {
    async view(ctx, opts = {}) {
        const r = wrap(this).toJSON();
        const json = {
            id: r.id,
            topicId: r.topicId,
            authorDid: r.authorDid,
            text: r.text,
            createdAt: r.createdAt,
        }

        // extend
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
        text: {
            type: "string"
        },
        createdAt: {
            type: "Date",
            onCreate: () => new Date(),
        }
    },
});