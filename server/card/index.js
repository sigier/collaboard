

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
`;



module.exports = {
  cardTypeDefs
};