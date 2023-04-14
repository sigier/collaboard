const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const merge = require("lodash/merge");
const mongoose = require("mongoose");
const { PubSub } = require("apollo-server");
const { createServer } = require("http");
require("dotenv").config();

const typeDefs = gql``;

const resolvers = {};

const MONGO_LINK = process.env.MONGO_LINK;

mongoose
  .connect(
    MONGO_LINK,
    {   useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology:true,
        useFindAndModify: false 
    }
  )
  .then(() => {
    console.log("mongodb connected now");
    const server = new ApolloServer({
      typeDefs,
      resolvers
    });
    const app = express();
    server.applyMiddleware({ app });
    const httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer);

    const PORT = process.env.PORT;
    httpServer.listen({ port: PORT }, () => {
      console.log(`Server is running in port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });