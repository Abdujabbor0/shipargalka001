const { 
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginDrainHttpServer 
} = require ('apollo-server-core')
const { ApolloServer } = require ('apollo-server-express')
const express = require ('express')
const { graphqlUploadExpress } = require ('graphql-upload')
const http = require ('http')
const config = require ('../config.js')
const schema = require ('./modules')
const path = require ('path')

;(async function startApolloServer() {
    const app = express()
    app.use(graphqlUploadExpress())
    const httpServer = http.createServer(app)
    app.use(express.static(path.join(process.cwd(),'files')))

    const server = new ApolloServer({
        introspection: true,
        schema,
        context: ({ req, res }) => {
            return {
                token: req.headers.token
            }
        },
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
            ApolloServerPluginDrainHttpServer({ httpServer })
        ],
    })

    await server.start()
    server.applyMiddleware({ app })

    await new Promise(resolve => httpServer.listen({ port: process.env.PORT || 2345 }, resolve))
    console.log(`🚀 Server ready at http://localhost:2345${server.graphqlPath}`)
})()
