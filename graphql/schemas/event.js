const { gql } = require('apollo-server-express');

module.exports = gql`

 type Event {
     id: ID!
     eventName: String!
     description: String!
     date: String!
     guests: [GuestResponse]
 }

 extend type Mutation {
     createNewEvent(input: CreateEventInput!): Event!
     updateEvent(input: UpdateEventInput!): Event!
     deleteEvent(eventId:ID!): String!
 }

 extend type Query{
     getAllEvents(input: Pagination): [Event!]
     getSpecificEvent(eventId: ID!): Event!
 }

 extend type Subscription{
  newEvent: Event!
  updatedEvent: Event!
  deletedEvent: Event!
}

 type GuestResponse{
    id: ID!
    email: String!
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