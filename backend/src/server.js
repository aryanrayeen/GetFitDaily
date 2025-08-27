import express from "express";
import workoutRoutes from "./routes/workoutRoutes.js";
import biometricsRoutes from "./routes/biometricsRoutes.js";
import mealRoutes from "./routes/mealsRouter.js";
import habitRoutes from "./routes/habitRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import {connectDB} from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
//middleware = used for auth check
app.use(express.json()); //this middleware will parse JSON bodies: get access to req.body 
app.use(cookieParser());
app.use(rateLimiter);

app.use((req,res,next) =>{
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
})

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/biometrics", biometricsRoutes);
console.log('Registering /api/meals routes...');
app.use("/api/meals", mealRoutes);
app.use("/api/habits", habitRoutes);

// Debug route to test if server is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

connectDB().then(() => {
    app.listen(PORT, 'localhost', () => {
        console.log(`Server started on PORT: ${PORT}`);
        console.log(`Server listening on http://localhost:${PORT}`);
        console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
        console.log(`Meal test endpoint: http://localhost:${PORT}/api/meals/test`);
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});

