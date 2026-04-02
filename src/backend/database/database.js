import "dotenv/config"
import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

let isConnected = false; 

const connectDB = async () => {

    if (isConnected) {
        console.log("=> Using existing MongoDB connection");
        return;
    }
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        isConnected = connectionInstance.connection.readyState === 1;
        
        console.log(`connected to: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`An error occured: ${error}`)
        throw new Error("Failed to connect to the database"); 
    }
}

export default connectDB;