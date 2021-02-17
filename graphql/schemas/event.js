const { gql } = require('apollo-server-express');

module.exports = gql`

 type Event {
     id: ID!
     eventName: String!
     description: String!
     date: String!
     invitedGuests: [Guest]
 }

 extend type Mutation {
     createNewEvent(input: CreateEventInput!): Event!
     updateEvent(input: UpdateEventInput!): Event!
     deleteEvent(eventId:ID!): String!
 }

input CreateEventInput{
    eventName: String!
    description:String!
    date: String!
}

input UpdateEventInput{
    eventId: ID!
    eventName: String
    description:String
    date: String
}

`;