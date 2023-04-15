const { gql } = require("apollo-server-express");

const sectionTypeDefs = gql`

    input insertSectionInput {
        title: String!
        label: String!
        placement: Int!
    }

    input updateSectionPkacementInput {
        sectionId: String!
        pos: Int!
    }

    type Section {
        id: ID!
        title: String!
        label: String!
        placement: Int!
        description: String
        cards: [Card]
    }

`;


module.exports = {
    sectionTypeDefs
  };