"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkRecSchema = void 0;
const graphql_1 = require("graphql");
const user_1 = require("./types/user");
exports.linkRecSchema = new graphql_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: {
            user: user_1.QueryUserField
        }
    }),
    mutation: new graphql_1.GraphQLObjectType({
        name: 'Mutation',
        fields: {}
    })
});
