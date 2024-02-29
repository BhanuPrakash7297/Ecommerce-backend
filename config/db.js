import mongoose from "mongoose";



const connectDB = async () => {
    try {
        const DB = process.env.DATABASE.replace(
            '<PASSWORD>', process.env.DATABASE_PASSWORD
        );
        const connect = await mongoose.connect(DB, {
            useNewUrlParser: true,
        });
        console.log("Data base connection successful");
    } catch (err) {
        console.log("Error related to connections here");
    }
}


export default connectDB;