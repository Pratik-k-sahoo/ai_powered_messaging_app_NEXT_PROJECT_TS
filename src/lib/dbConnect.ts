import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if(connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  
  try {
    const db = await mongoose.connect("mongodb://localhost:27017");
    connection.isConnected = db.connections[0].readyState
    console.log("DB connected successfully");    
  } catch (error) {
    console.log("Database connection failed: ", error);
    process.exit(1);
  }
}

export default dbConnect;