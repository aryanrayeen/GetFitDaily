import express from "express";
import workoutRoutes from "./routes/workoutRoutes.js";
import biometricsRoutes from "./routes/biometricsRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import {connectDB} from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002

app.use(cors({
    origin:"http://localhost:5173",
}));
//middleware = used for auth check
app.use(express.json()); //this middleware will parse JSON bodies: get access to req.body 
app.use(rateLimiter);

// Routes
// Only register workout route once
app.use("/api/workouts", workoutRoutes);
app.use("/api/biometrics", biometricsRoutes);
app.use("/api/meals", mealRoutes);


// app.use((req,res,next) =>{
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//     next();
// })

app.use("/api/workouts", workoutRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT);
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});

