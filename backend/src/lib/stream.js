import { StreamChat } from 'stream-chat'
import dotenv from 'dotenv'
dotenv.config()
const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET
if (!apiKey || !apiSecret) {
  console.log('Stream API key or secret is missing')
}
const streamClient = StreamChat.getInstance(apiKey, apiSecret)
export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData])
    return userData
  } catch (error) {
    console.log('Error upsert stream user:', error)
  }
}

export const generateStreamToken = async (userId) => {
  try {
    // ensure userid is string
    const userIdString = userId.toString()
    return streamClient.createToken(userIdString)

  } catch (error) {
    console.log('error generating Stream token:', error)
  }
}