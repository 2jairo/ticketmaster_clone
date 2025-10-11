import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectMongoDb } from './config/mongoConnection'
import concertsRoutes from './routes/concertRoutes'
import categoryRoutes from './routes/categoryRoutes'
import userRoutes from './routes/userRoutes'
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

app.use(notFoundHandler)
app.use(errorHandler)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`)
})
