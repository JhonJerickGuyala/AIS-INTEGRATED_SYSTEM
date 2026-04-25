import express from "express";
import cors from "cors";
import 'dotenv/config.js';

import UserRoutes from "./routes/UserRoutes.js"

//create expres app
const app = express();

//enable cors tofrontend
let corsOptions = {
    origin: process.env.ORIGIN
};

//middleware
app.use(express.json());
app.use(cors(corsOptions));

//this used to log the request on the console
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// --- DITO DAPAT ANG ROUTES (Bago mag-listen) ---

app.use('/user', UserRoutes); 
// ----------------------------------------------

try {
    const port = process.env.PORT || 3000; // Define port variable here for safety
    app.listen(port, () => {
        console.log(`listening to port ${port}...`);
    });
} catch(e) {
    console.log(e);
}