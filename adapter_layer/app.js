import express from "express";
import 'dotenv/config.js';

import authRoutes from "./routes/authRoutes.js";

//create expres app
const app = express();

//middleware
app.use(express.json());

//this used to log the request on the console
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});


app.use('/auth', authRoutes); 

try {
    const port = process.env.PORT || 5000; // Define port variable here for safety
    app.listen(port, () => {
        console.log(`listening to port ${port}...`);
    });
} catch(e) {
    console.log(e);
}