console.log("This is the index file");

import  app  from "./app.js";
import { connectToDatabase } from "./db/connection.js";

const PORT  = process.env.PORT || 5000;

connectToDatabase().then(()=> {
    app.listen(PORT, ()=> {
        console.log("Server is loaded and connected to MongoDB")
    })
}).catch((err) => {
    console.log(err)
    throw new Error("An error occured while trying to load the server");
})



