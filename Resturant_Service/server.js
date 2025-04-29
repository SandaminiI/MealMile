import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import menuRoutes from './routes/menuRoute.js';
import cors from 'cors';

//config env
dotenv.config();

//database congit
connectDB();

//rest object
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // Allow your frontend domain
    credentials: true, // Allow credentials (cookies)
};

//middelware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
// app.use(cors());
app.use(cors(corsOptions));

//routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/menuItem',menuRoutes);

app.get("/", (req, res) => {
    res.send({
        message: "welcome to resturant managment server"
    })
})

//port
const PORT = process.env.PORT || 8086;

app.listen(PORT, () => {
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});