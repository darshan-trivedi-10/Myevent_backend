import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors'

// Router
import eventRouter from "./Router/eventRouter.js";
import authRouter from "./Router/authRouter.js";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

const port = process.env.PORT || 5000;
dotenv.config();

mongoose.connect(process.env.DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(port, () => {
        console.log('listening')
    })
}).catch((error) => {
    console.log(error.message)
})

app.use('/event', eventRouter);
app.use('/auth', authRouter);
app.use('/', (req, res) => {
    res.send('Running . . .');
})    

