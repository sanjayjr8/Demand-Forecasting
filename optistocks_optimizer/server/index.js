const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(express.json());
async function connectToMongo() {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`Connected To DB lol`);
  }) 
}
app.set('trust proxy', true);

// Security middlewares
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}));

connectToMongo();

// Global error handler
const errorHandler = require('./middlewares/ExpressError.js');

// Log all requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
const companyRoutes = require("./routes/companyRoutes.js");
const stockRoutes = require("./routes/stockRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const dataRoutes = require("./routes/dataRoutes.js");
const predictionRoutes = require("./routes/predictionRoutes.js");
const whatsappRoutes = require("./routes/chatRoutes.js");

// Base route
app.get("/", (req, res) => {
  res.json('/ route here');
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard/companies", companyRoutes);
app.use("/api/dashboard/companies/data", dataRoutes);
app.use("/api/dashboard/companies/prediction", predictionRoutes);
app.use("/api/dashboard/companies/chat", whatsappRoutes);
app.use("/api/dashboard/companies/:companyId/stocks", stockRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(process.env.PORT,async ()=>{
  console.log(
    `Healthy backend server running ${process.env.PORT}`
  )
})
 
