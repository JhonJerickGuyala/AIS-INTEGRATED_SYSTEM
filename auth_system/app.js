import express from "express";
import 'dotenv/config.js'
import UserRoutes from "./routes/UserRoutes.js";
import cors from "cors";
import authHandler from "./middleware/authHandler.js";

const app = express();
console.log(process.env.ORIGIN)

let corsOptions = {
    origin: process.env.ORIGIN
}

app.use(express.json());
app.use(cors(corsOptions));



app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})


const port = 3000;


try {
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`Listening to port ${process.env.PORT || 3000}...`);
    })
} catch (e) {
    console.log(e);
}

app.use('/user', UserRoutes)





