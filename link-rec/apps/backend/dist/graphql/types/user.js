"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserField = exports.UserInputType = exports.QueryUserField = exports.UserType = void 0;
const graphql_1 = require("graphql");
const database_1 = require("../../db/database");
const user_table_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.UserType = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        phoneNumber: { type: graphql_1.GraphQLString },
        webPage: { type: graphql_1.GraphQLString },
        location: { type: graphql_1.GraphQLString },
        // education: { type: new GraphQLList(EducationType) },
        // experience: { type: new GraphQLList(ExperienceType) },
        // connections: { type: new GraphQLList(UserType) },
        // jobSeekingStatus: { type: JobSeekingStatus },
    },
});
exports.QueryUserField = {
    type: exports.UserType,
    args: {
        id: { type: graphql_1.GraphQLID }
    },
    resolve: (_source, args, _context, _info) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield database_1.db.select().from(user_table_1.userTable).where((0, drizzle_orm_1.eq)(user_table_1.userTable.id, Number(args.id)));
        return user[0];
    })
};
exports.UserInputType = new graphql_1.GraphQLInputObjectType({
    name: 'UserInput',
    fields: {
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        phoneNumber: { type: graphql_1.GraphQLString },
        webPage: { type: graphql_1.GraphQLString },
        location: { type: graphql_1.GraphQLString },
    },
});
exports.AddUserField = {
    type: graphql_1.GraphQLString,
    args: {
        input: { type: new graphql_1.GraphQLNonNull(exports.UserInputType) }
    },
    resolve: (_source, args, _context, _info) => __awaiter(void 0, void 0, void 0, function* () {
        yield database_1.db.insert(user_table_1.userTable).values(args.input);
        return "ok"; // todo: return user id or something
    })
};
