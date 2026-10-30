import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { connectCloudinary } from './config/cloudinary.js';

// 1. Import Auth Routes
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from "./routes/dashboardRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import institutionRoutes from './routes/institutionRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import programRoutes from './routes/programRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import galleryRoutes from "./routes/galleryRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";


// Load environment variables
dotenv.config();

// Connect Database & Cloudinary
connectDB();
connectCloudinary();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// 2. Mount Auth Routes
app.use('/api/auth', authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/applications", applicationRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/faqs', faqRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/settings", settingsRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Shokour Website API Server is Running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});