import dotenv from 'dotenv'

dotenv.config()

export default {
    mongo_uri: process.env.MONGO_URI,
    port: process.env.PORT,
    node_env: process.env.NODE_ENV
}