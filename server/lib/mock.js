
import { wrap } from "@mikro-orm/core";
import { load } from "js-yaml";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export async function loadMockData(api) {
    const db = api.db;

    const map = [
        ["topics.yaml", "Topic"],
        ["replies.yaml", "Reply"],
    ];

    const em = db.em.fork();

    for (const [fn, entityName] of map) {
        const items = await load(readFileSync(join("./mock-data", fn)));
        const entityRepo = em.getRepository(entityName);
        let repo = entityRepo;

        for (const item of items) {
            const x = repo.create(item);
            em.persist(x);
        }
    }
    await em.flush();
}
