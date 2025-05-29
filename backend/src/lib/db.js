import mongoose from 'mongoose'

export const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDb Connected ${connect.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}