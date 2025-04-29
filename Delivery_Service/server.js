import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import deliveryRoutes from './routes/deliveryRoutes.js'
import driverRoutes from './routes/driverRoutes.js'
import cors from 'cors';

//config env
dotenv.config();

//database congit
connectDB();

//rest object
const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/v1/delivery',deliveryRoutes);
app.use('/api/v1/driver', driverRoutes);

app.get("/", (req, res) => {
    res.send({
        message: "welcome to Delivery managment server"
    })
})

//port
const PORT = process.env.PORT || 8090;

app.listen(PORT, () => {
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});