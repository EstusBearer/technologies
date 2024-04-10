const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const apiRoutes = require('./routes/api');

const JWT_SECRET = 'your_jwt_secret_here';

const typeDefs = gql`
  type User {
    email: String!
    login: String!
    password: String!
  }

  type Query {
    login(email: String!, password: String!): String # Simulated login response
  }

  type Mutation {
    createUser(email: String!, login: String!, password: String!): User
  }
`;

const User = require('./models/User');

const resolvers = {
    Query: {
        login: async (_, { email, password }) => {
            return `Login attempted with email: ${email}`;
        },
    },
    Mutation: {
        createUser: async (_, { email, login, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                email,
                login,
                password: hashedPassword,
            });

            try {
                return await newUser.save();
            } catch (err) {
                console.error(err);
                throw new Error('Error creating user');
            }
        },
    },
};

const connectDB = require('./db');
const cors = require("cors");
connectDB();

const startServer = async () => {
    const app = express();
    const server = new ApolloServer({ typeDefs, resolvers });

    app.use(cors({
        origin: 'http://localhost:5173'
    }));

    await server.start();
    server.applyMiddleware({ app });

    app.use(express.json());

    app.use('/api', apiRoutes);

    app.listen({ port: 4000 }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
};

startServer().then(r => {});
