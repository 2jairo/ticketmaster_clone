import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectMongoDb } from './config/mongoConnection'
import concertsRoutes from './routes/concertRoutes'
import categoryRoutes from './routes/categoryRoutes'
import userRoutes from './routes/userRoutes'
import commentsRoutes from './routes/commentsRoutes'
import musicGroupsRoutes from './routes/musicGroupRoutes'
import profileRoutes from './routes/profileRoutes'
import { errorHandler, notFoundHandler } from './error/err'
import cookieParser from 'cookie-parser'

dotenv.config()
await connectMongoDb(process.env.MONGO_URI!)
const app = express()

app.use(cors({
    origin: ['http://127.0.0.1:4200'],
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', userRoutes)
app.use('/api', concertsRoutes)
app.use('/api', categoryRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/groups', musicGroupsRoutes)
app.use('/api/profile', profileRoutes)

app.use(notFoundHandler)
app.use(errorHandler)


const PORT = parseInt(process.env.PORT!) || 3000

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Listening on localhost:${PORT}`)
})
