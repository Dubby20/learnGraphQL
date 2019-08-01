const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLBoolean
} = require("graphql");

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
    number: { type: GraphQLString },
    gender: { type: GraphQLString },
    isAdult: { type: GraphQLBoolean }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get(`http://localhost:3000/customers/${args.id}`)
          .then(res => res.data);
      }
    },

    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parent, args) {
        return axios
          .get(`http://localhost:3000/customers`)
          .then(res => res.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        number: { type: new GraphQLNonNull(GraphQLString) },
        gender: { type: new GraphQLNonNull(GraphQLString) },
        isAdult: { type: GraphQLBoolean }
      },
      resolve(parent, args) {
        return axios
          .post(`http://localhost:3000/customers`, {
            name: args.name,
            email: args.email,
            age: args.age,
            number: args.number,
            gender: args.gender,
            isAdult: args.isAdult
          })
          .then(res => res.data);
      }
    },

    editCustomer: {
      type: CustomerType,
      args: {
        id: {
          type: GraphQLString
        },
        name: {
          type: GraphQLString
        },
        email: {
          type: GraphQLString
        },
        age: {
          type: GraphQLInt
        },
        number: {
          type: GraphQLString
        },
        gender: {
          type: GraphQLString
        },
        isAdult: {
          type: GraphQLBoolean
        }
      },
      resolve(parent, args) {
        return axios
          .patch(`http://localhost:3000/customers/${args.id}`, args)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
