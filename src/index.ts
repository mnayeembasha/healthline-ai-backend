import express from 'express';
import { MONGO_URL, PORT } from './config';
// import userRouter from './routes/user';
import cors from 'cors';
import { connectDb } from './db';
import doctorRouter from './routes/doctor';
const app= express();
app.use(express.json());
connectDb(MONGO_URL as string);
const corsOptions = {
    origin: true, // This allows all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };
  app.use(cors(corsOptions));

app.use("/api/doctors",doctorRouter);


app.get("/",(req,res)=>{
    res.json({message:"Welcome to Home Page"});
});

app.get("*",(req,res)=>{
    res.status(404).json({message:"Invalid Route | Page Not Found"});
})

app.listen(PORT);