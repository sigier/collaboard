const { gql } = require("apollo-server-express");
const queryResolvers = require("./Resolvers/Query");


const segmentTypeDefs = gql`

    input insertSegmentInput {
        title: String!
        label: String!
        placement: Int!
    }

    input updateSegmentPlacementInput {
        segmentId: String!
        pos: Int!
    }

    type Segment {
        id: ID!
        title: String!
        label: String!
        placement: Int!
        description: String
        cards: [Card]
    }

    extend type Query {
        hello: String
        fetchSegments: [Segment]
      }

`;


const segmentResolvers = {
    Query: {
      ...queryResolvers
    },
  };


module.exports = {
    segmentTypeDefs,
    segmentResolvers
  };