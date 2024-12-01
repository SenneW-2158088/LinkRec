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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express4_1 = require("@apollo/server/express4");
const graphql_router_1 = require("./rest/graphql-router");
const apollo_server_1 = require("./graphql/apollo-server");
const PORT = Number(process.env.BACKEND_PORT);
const app = (0, express_1.default)();
function setupRoutes(apolloServer) {
    app.use("/user", (0, graphql_router_1.graphqlRouter)(apolloServer));
}
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    // Note you must call `start()` on the `ApolloServer`
    // instance before passing the instance to `expressMiddleware`
    const apolloServer = (0, apollo_server_1.createApolloServer)();
    yield apolloServer.start();
    app.use('/graphql', express_1.default.json(), (0, express4_1.expressMiddleware)(apolloServer));
    setupRoutes(apolloServer);
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`The GraphQL endpoint is http://localhost:${PORT}/graphql`);
}));
