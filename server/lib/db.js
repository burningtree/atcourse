import { wrap } from "@mikro-orm/core";
import { loadMockData } from "./mock.js";

const { MikroORM, RequestContext } = await import(`@mikro-orm/sqlite`);

export async function initDatabase(api, conf) {
    const orm = await MikroORM.init({
        dbName: "./atpbb.sqlite",
        entities: ["./entities"],
        debug: api.env === "development",
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
                api,
                em,
                topic: em.getRepository("Topic"),
                reply: em.getRepository("Reply"),
                wrap,
            };
        },
    };
}