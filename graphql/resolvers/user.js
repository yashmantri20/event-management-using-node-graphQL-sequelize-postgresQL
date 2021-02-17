const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { AuthenticationError, UserInputError, ApolloError } = require("apollo-server-express");
const { validRegiterInput, validLoginInput, validChangePasswordInput, validResetPasswordInput } = require('../../UserValidation');
const crypto = require('crypto');
const { mailSender } = require('../../mailSender');
const { Op } = require("sequelize");

const { User, Event, Guest } = require("../../database/models");

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id
        },
        process.env.SECRET_KEY
    );
}

module.exports = {
    Mutation: {
        async register(_, args) {
            const { username, email, password } = args.input;

            const err = validRegiterInput(username, email, password);
            if (err) throw new UserInputError(err)

            try {
                const findUser = await User.findOne({ where: { email } });
                if (!findUser) {
                    const hash = await bcrypt.hash(password, 12);
                    const user = await User.create({ username, email, password: hash });
                    const token = generateToken(user);
                    return { ...user.toJSON(), token }
                }
                else {
                    throw new UserInputError("User Already Exist")
                }
            }
            catch (error) {
                console.log(error)
                throw new ApolloError(error.message)
            }
        },

        async login(_, { input }) {
            const { email, password } = input;
            const err = validLoginInput(email, password);

            if (err) throw new UserInputError(err)

            try {
                const user = await User.findOne({ where: { email } });

                if (!user) throw new UserInputError("User Does Not Exist");

                const match = bcrypt.compareSync(password, user.password);

                if (!match) throw new AuthenticationError("Invalid credentials");
                const token = generateToken(user);
                return { ...user.toJSON(), token };
            }
            catch (error) {
                throw new ApolloError(error.message)
            }
        },


        async updatePassword(_, { oldPassword, newPassword }, context) {
            const err = validChangePasswordInput(oldPassword, newPassword);
            if (err) throw new UserInputError(err)

            try {
                const user = context.user;
                if (user) {
                    const match = bcrypt.compareSync(oldPassword, user.password);
                    if (!match) throw new AuthenticationError("Invalid credentials");

                    const updated = await user.update(
                        {
                            password: await bcrypt.hash(newPassword, 12)
                        })

                    if (updated) return "Password Updated Successfully"
                }
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },

        async resetPassword(_, { email }) {
            const err = validResetPasswordInput(email);

            if (err) throw new UserInputError(err)

            try {
                const findUser = await User.findOne({
                    where:
                        { email }
                });
                if (findUser) {
                    const token = crypto.randomBytes(20).toString('hex');
                    await findUser.update({
                        resetPasswordToken: token,
                        resetPasswordExpires: Date.now() + 60000,
                    })
                    await mailSender(email, findUser.username, token);
                    return "Recovery Mail sent"
                }
                return "User Does not Exist"
            }
            catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async changePassword(_, { newPassword, token }) {
            const err = validChangePasswordInput(newPassword);

            if (err) throw new UserInputError(err)

            try {
                const user = await User.findOne(
                    {
                        where:
                        {
                            resetPasswordToken: token,
                            resetPasswordExpires: {
                                [Op.gt]: String(Date.now())
                            }
                        }
                    })
                if (user) {
                    await user.update({
                        password: await bcrypt.hash(newPassword, 12)
                    })
                    return "Password Reset Successfully !"
                }

                return "Link has been expired !"

            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
    },

    Query: {
        async getUser(_, __, context) {
            const { user } = context
            const event = await user.getEvents();

            const guest = await Guest.findAll({
                where: {
                    email: user.email
                },
                include: [{ model: Event, as: "events" }]
            },
            )
            return { ...user.toJSON(), createdEvents: event, invitedEvents: guest };
        }
    }
};

