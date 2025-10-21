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

dotenv.config()
await connectMongoDb(process.env.MONGO_URI!)
const app = express()

app.use(cors({
    origin: 'http://localhost:4200'
}))
app.use(express.json())

app.use('/api/auth', userRoutes)
app.use('/api', concertsRoutes)
app.use('/api', categoryRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/groups', musicGroupsRoutes)
app.use('/api/profile', profileRoutes)

app.use(notFoundHandler)
app.use(errorHandler)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`)
})
