const { makeExecutableSchema } =require('@graphql-tools/schema')

const UserModule = require('./user')
const type = require('./type')
module.exports = makeExecutableSchema({
    typeDefs: [
        UserModule.typeDefs,
        type.typeDefs
    ],
    resolvers: [
        UserModule.resolvers,
        type.resolvers
    ]
})