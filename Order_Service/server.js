const express = require("express");
const colors = require("colors");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8089;

//database congit
connectDB();

// CORS Middleware
app.use(cors());

app.use(express.json());
app.use("/api/cart",require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`.bgCyan.white);
});