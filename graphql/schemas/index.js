const { gql } = require('apollo-server-express');
const userType = require('./user')
const EventType = require('./event')
const GuestType = require('./guest')
const PaginationType = require('./pagination')

const rootType = gql`
 type Query {
     root: String
 }
 type Mutation {
     root: String
 }

 type Subscription {
     root: String
 }
`;

module.exports = [rootType, userType, EventType, GuestType, PaginationType];