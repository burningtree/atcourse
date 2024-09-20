import { EntitySchema, wrap } from "@mikro-orm/core";

export const schema = new EntitySchema({
    name: "AuthSession",
    properties: {
        key: {
            type: "string",
            primary: true,
        },
        session: {
            type: "json",
        }
    },
});