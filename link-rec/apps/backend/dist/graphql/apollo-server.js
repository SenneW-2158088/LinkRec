"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApolloServer = void 0;
const server_1 = require("@apollo/server");
const schema_1 = require("./schema");
const createApolloServer = () => {
    return new server_1.ApolloServer({
        schema: schema_1.linkRecSchema
    });
};
exports.createApolloServer = createApolloServer;
