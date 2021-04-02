const {
  AuthenticationError,
  UserInputError,
  ApolloError,
} = require("apollo-server-express");

const { Event, Guest } = require("../../database/models");
const { validInviteInput } = require("../../utils/EventValidation");

module.exports = {
  Mutation: {
    async createGuest(_, { input }, context) {
      const { eventId, email } = input;
      const { user } = context;
      if (!user) throw new AuthenticationError("User Not Authenticated");

      const event = await Event.findByPk(eventId);
      if (!event) throw new UserInputError("Event Does not exist");

      if (event.userId !== user.id)
        throw new AuthenticationError("Your not allowed to invite the guest");

      const err = validInviteInput(email);
      if (err) throw new UserInputError(err);

      const userAlreadyInvited = await Guest.findOne({
        where: {
          eventId,
          email,
        },
      });

      if (userAlreadyInvited)
        throw new AuthenticationError("User Already Invited");
      try {
        const guest = await user.createGuest({
          email,
          eventId,
          userId: user.id,
        });
        return { ...guest.toJSON(), events: event };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
};
