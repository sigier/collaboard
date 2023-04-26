const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const merge = require("lodash/merge");
const mongoose = require("mongoose");
const { PubSub } = require("apollo-server");
const { createServer } = require("http");
require("dotenv").config();

const { cardResolvers, cardTypeDefs } = require("./card");
const { segmentResolvers, segmentTypeDefs } = require("./segment");
const cardModel = require("./card/model");
const segmentModel = require("./segment/model");
const CONSTANTS = require("./constants");

const typeDefs = gql`
  type Subscription {
    segmentAdded: Segment
    cardAdded: Card
    onSegmentPlacementChange: Segment
    onCardPlacementChange: Card
  }  
  ${cardTypeDefs}
  ${segmentTypeDefs}
`;

const pubsub = new PubSub();

const subscriptionsResolvers = {
  Subscription: {
    segmentAdded: {
      subscribe: () =>
        pubsub.asyncIterator([CONSTANTS.SEGMENT_ADDED]),
    },
    cardAdded: {
      subscribe: () =>
        pubsub.asyncIterator([CONSTANTS.CARD_ADDED]),
    },
    onSegmentPlacementChange: {
      subscribe: () =>
        pubsub.asyncIterator([CONSTANTS.ON_SEGMENT_PLACEMENT_CHANGE]),
    },
    onCardPlacementChange: {
      subscribe: () =>
        pubsub.asyncIterator([CONSTANTS.ON_CARD_PLACEMENT_CHANGE]),
    },
  },
};

const customResolvers = {
  Segment: {
    cards(parent, args, cxt) {
      return cxt.card.getCardBySegmentId(parent._id);
    },
  },
};

const resolvers = {
  cardResolvers,
  segmentResolvers,
  customResolvers,
  subscriptionsResolvers

};

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
      resolvers,
      context: () =>(
        {
          card: cardModel,
          segment: segmentModel,
          publisher: pubsub,
          CONSTANTS: CONSTANTS
        }
      )
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