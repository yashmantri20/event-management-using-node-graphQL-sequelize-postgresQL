const { gql } = require('apollo-server-express');

module.exports = gql`
    type Guest{
        id: ID!
        events: Event!
        email: String!
    }

    extend type Mutation{
        createGuest(input: createGuestInput!): Guest!
    }

    input createGuestInput{
        eventId: ID!
        email: String!
    }
`
