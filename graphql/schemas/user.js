const { gql } = require('apollo-server-express');

module.exports = gql`

 type User {
     id: ID!
     username: String!
     email: String!
     password: String!
     resetPasswordToken: String
     resetPasswordExpires: String
     invitedEvents: [Guest]
     createdEvents: [Event]
 }

 extend type Mutation {
     register(input: RegisterInput!): RegisterResponse
     login(input: LoginInput!): LoginResponse
     updatePassword(oldPassword:String!,newPassword:String!): String!
     resetPassword(email:String!): String!
     changePassword(newPassword: String!,token:String!): String!
 }

 extend type Query{
     getUser: User!
 }

 type RegisterResponse {
    id: ID!
    username: String!
    email: String!
    token: String!
 }

 input RegisterInput {
     username: String!
     email: String!
     password: String!
 }

input LoginInput {
     email: String!
     password: String!
 }

  type LoginResponse {
    id: ID!
    username: String!
    email: String!
    token: String!
 }
`;