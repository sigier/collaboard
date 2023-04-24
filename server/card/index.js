
const mutationResolvers = require("./Resolvers/Mutation");
const queryResolvers = require("./Resolvers/Query");
const { gql } = require("apollo-server-express");

const cardTypeDefs = gql`
  input insertCardInput {
    title: String!
    label: String!
    segmentId: ID!
    placement: Int!
  }
  input updateCardPlacementInput {
    cardId: String!
    segmentId: String!
    placement: Int!
  }
  input cardSegmentInput {
    segmentId: String!
  }
  type Card {
    id: ID
    title: String!
    label: String!
    description: String
    placement: Int
    segmentId: String!
  }

  type Query {
    card: String
    fetchCardsBySegmentId(request: cardSegmentInput): [Card]
  }
  type Mutation {
    insertCard(request: insertCardInput): Card
    updateCardPlacement(request: updateCardPlacementInput): Card
  }
`;

const cardResolvers = {
  Query: {
    ...queryResolvers,
  },
  Mutation: {
    ...mutationResolvers,
  },
};



module.exports = {
  cardTypeDefs,
  cardResolvers
};