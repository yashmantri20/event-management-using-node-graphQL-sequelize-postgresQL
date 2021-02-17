const usersResolvers = require('./user');
const eventsResolvers = require('./event');
const guestsResolvers = require('./guest');

module.exports = [usersResolvers, eventsResolvers, guestsResolvers];