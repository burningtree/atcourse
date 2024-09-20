import { EntitySchema, wrap } from "@mikro-orm/core";
import { createId } from "@paralleldrive/cuid2";
import slugify from "slugify";

export class Topic {

    url() {
        return '/t/' + this.id + '-' + slugify(this.title, { strict: true, lower: true })
    }

    recordUri() {
        return `at://${this.authorDid}/app.atpbb.forum.topic/${this.rkey}`
    }

    async view(ctx, opts = {}) {
        const t = wrap(this).toJSON();
        const json = {
            id: t.id,
            title: t.title,
            categoryId: t.categoryId,
            authorDid: t.authorDid,
            rkey: t.rkey,
            tags: t.tags,
            viewCount: t.viewCount,
            repliesCount: t.repliesCount,
            lastActivity: t.lastActivity,
            createdAt: t.createdAt,
        }
        // extend
        json.url = this.url()
        json.recordUri = this.recordUri()
        const author = await ctx.instance.agent.getProfile({ actor: t.authorDid })
        if (author) {
            json.author = author.data
        }

        if (opts.text) {
            json.text = t.text
        }
        if (opts.replies) {
            const replies = await ctx.reply.find({ topicId: t.id })
            json.replies = await Promise.all(replies.map(r => r.view(ctx)))
        }
        return json
    }
}

export const schema = new EntitySchema({
    name: "Topic",
    class: Topic,
    properties: {
        id: {
            type: "int",
            primary: true,
            autoincrement: true,
        },
        title: {
            type: "string"
        },
        categoryId: {
            type: "string",
            nullable: true,
        },
        authorDid: {
            type: "string"
        },
        rkey: {
            type: "string",
            nullable: true
        },
        tags: {
            type: "array",
            default: []
        },
        text: {
            type: "string"
        },
        viewCount: {
            type: "int",
            default: 0,
        },
        repliesCount: {
            type: "int",
            default: 0,
        },
        lastActivity: {
            type: "Date",
            onCreate: () => new Date(),
        },
        createdAt: {
            type: "Date",
            onCreate: () => new Date(),
        }
    },
});