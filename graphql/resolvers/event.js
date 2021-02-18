const { AuthenticationError, UserInputError, ApolloError } = require("apollo-server-express");

const { Event, Guest } = require("../../database/models");
const { validEventCreated } = require('../../EventValidation');
const { Op } = require("sequelize");


module.exports = {
    Query: {
        async getAllEvents(_, { input }) {
            let searchquery = {}

            const { page, pagesize, sort, search } = input;
            let limit = pagesize || null;
            let offset = (page - 1) * pagesize || 0;

            if (sort) {
                var { sortbyvalue, sorttype } = sort;
                order = [[sortbyvalue, sorttype]];
            }
            else {
                order = []
            }

            if (search) {
                const { searchbyvalue, text } = search;
                searchquery[searchbyvalue] = { [Op.iLike]: text + "%" }
            }

            try {
                const events = await Event.findAll(
                    {
                        where: searchquery,
                        include: { model: Guest, as: "guests" },
                        limit,
                        offset,
                        order
                    });

                if (!events) throw new UserInputError("No Events")
                return events;
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },

        async getSpecificEvent(_, { eventId }) {
            try {
                const event = await Event.findByPk(eventId, {
                    include: [{ model: Guest, as: "guests" }]
                });
                if (!event) throw new UserInputError("Event Does not exists")
                return event;
            } catch (error) {
                throw new ApolloError(error.message)
            }
        }
    },

    Mutation: {
        async createNewEvent(_, { input }, context) {
            const { eventName, description, date } = input;
            const err = validEventCreated(eventName, description, date);

            if (err) throw new UserInputError(err)

            try {
                const { user } = context;
                if (!user) throw new AuthenticationError("User Not Authenticated");
                const event = await user.createEvent({ eventName, description, date, userId: user.id })
                return event;
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },

        async updateEvent(_, { input }, context) {
            const { eventId, eventName, description, date } = input;
            const event = await Event.findByPk(eventId);

            if (!event) throw new UserInputError("Event Does not exist")

            const err = validEventCreated(eventName || event.eventName, description || event.description, date || event.date);

            if (err) throw new UserInputError(err)

            try {

                const { user } = context;
                if (!user) throw new AuthenticationError("User Not Authenticated");

                if (event.userId !== user.id) throw new AuthenticationError("User Not Allowed to update the event");

                const updatedEvent = await event.update(input);
                return updatedEvent;

            } catch (error) {
                throw new ApolloError(error.message)
            }
        },

        async deleteEvent(_, { eventId }, context) {
            try {
                const { user } = context;
                const event = await Event.findByPk(eventId)
                if (!event) throw new ApolloError("Event Does not exist")

                if (event.userId === user.id) {
                    await Event.destroy({
                        where: {
                            id: eventId
                        }
                    })
                    return "Event Deleted"
                }
                return "Your not allowed to delete the event"

            } catch (error) {
                throw new ApolloError(error.message)
            }
        }

    },
};

