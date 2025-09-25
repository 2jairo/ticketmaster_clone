import mongoose from 'mongoose'

export const connectMongoDb = async (uri: string) => {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(uri)
    } catch (error) {
        console.log(error)       
    }
}