import { EntitySchema, wrap } from "@mikro-orm/core";

export const schema = new EntitySchema({
    name: "AuthState",
    properties: {
        key: {
            type: "string",
            primary: true,
        },
        state: {
            type: "string",
        }
    },
});