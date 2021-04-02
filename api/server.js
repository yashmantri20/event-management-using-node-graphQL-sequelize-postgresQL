const express = require("express");
const { createServer } = require("http");
const { ApolloServer, PubSub } = require("apollo-server-express");
const cors = require("cors");
const typeDefs = require("../graphql/schemas");
const resolvers = require("../graphql/resolvers");
const { verifyToken } = require("../graphql/context/verify-token");
const DateDirective = require("../graphql/directives/date");
const app = express();
require("dotenv").config();

const pubsub = new PubSub();
app.use(cors());

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    date: DateDirective,
  },
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      if (connectionParams.Authorization) {
        const user = await verifyToken(connectionParams.Authorization);
        return user;
      }
    },
    onDisconnect: (webSocket, context) => {
      console.log("Disconnected!");
    },
  },
  context: ({ req, res }) => ({ req, res, pubsub }),
  introspection: true,
  playground: {
    settings: {
      "schema.polling.enable": false,
    },
  },
});

apolloServer.applyMiddleware({ app });

const server = createServer(app);
apolloServer.installSubscriptionHandlers(server);

module.exports = server;
