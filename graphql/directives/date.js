const { SchemaDirectiveVisitor } = require("apollo-server-express");
const { defaultFieldResolver, GraphQLString } = require("graphql");

class DateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { format } = this.args;
    field.resolve = async function (...args) {
      const date = await resolve.apply(this, args);
      return require("dateformat")(date, format);
    };
    field.type = GraphQLString;
  }
}

module.exports = DateDirective;
