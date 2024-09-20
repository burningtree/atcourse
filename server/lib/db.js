import { wrap } from "@mikro-orm/core";
import { loadMockData } from "./mock.js";

const { MikroORM, RequestContext } = await import(`@mikro-orm/sqlite`);

export async function initDatabase(did) {
    if (!did) {
        throw new Error('initDatabase: no DID')
    }
    const orm = await MikroORM.init({
        dbName: `./data/${did}.sqlite`,
        entities: ["./entities"],
        debug: process.env.NODE_ENV === "development",
        logger: (msg) => console.log(msg) //api.logger.trace(msg),
    });

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