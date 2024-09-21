import { wrap } from "@mikro-orm/core";
import { loadMockData } from "./mock.js";

import { schema as ReplySchema } from "../entities/reply.js";
import { schema as TopicSchema } from "../entities/topic.js";
import { schema as AuthSessionSchema } from "../entities/authsession.js";
import { schema as AuthStateSchema } from "../entities/authstate.js";

const { MikroORM, RequestContext } = await import(`@mikro-orm/libsql`);


export async function initDatabase(did) {
    if (!did) {
        throw new Error('initDatabase: no DID')
    }

    let orm;
    try {
        orm = await MikroORM.init({
            dbName: `../data/${did}.sqlite`,
            entities: [
                ReplySchema,
                TopicSchema,
                AuthSessionSchema,
                AuthStateSchema
            ],
            debug: process.env.NODE_ENV !== "production",
            logger: (msg) => console.log(msg) //api.logger.trace(msg),
        });
    } catch (e) {
        console.log(e)
        throw e
    }

    //await orm.schema.refreshDatabase();
    //await loadMockData({ orm, em: orm.em });

    return {
        orm,
        em: orm.em,
        getContext() {
            const em = orm.em.fork();
            return {
                em,
                topic: em.getRepository("Topic"),
                reply: em.getRepository("Reply"),
                wrap,
            };
        },
    };
}