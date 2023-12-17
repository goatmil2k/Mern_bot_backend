import mongoose from "mongoose";
mongoose.set('strictQuery', true);

const errorMessage: string = "Cannot connect to MongoDB";

export async function connectToDatabase() {
    try {

        let url = process.env.MONGODB_URL

        if (!url) {
            throw new Error (errorMessage);
        }

        await mongoose.connect(url);

    } catch (error) {
        console.log(error);
        throw new Error (errorMessage);
    }
}

export async function disconnectFromDatabase() {
    try {
        await mongoose.disconnect();
    }
    catch(error) {
        console.log(error);
        throw new Error ("Could not disconnect from MongoDB");
    }
}