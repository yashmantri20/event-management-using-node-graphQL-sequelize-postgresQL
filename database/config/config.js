require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: "postgres",
    database: "graphql_event_management",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "postgres",
    database: "graphql_event_management",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.USER,
    password: process.env.DATABASEPASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: "postgres",
  },
};
