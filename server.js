import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'



const app = express()
app.use(cookieParser());
const port = process.env.PORT || 5000

// Define allowed origins
app.use(
  cors({
    origin: ['http://localhost:5173','http://localhost:5174'], // Add both frontend and admin URLs
     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

  app.options("*", cors());


  
  // Optional error handler for uncaught errors
  app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Error details hidden in production",
    });
  }); 

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

app.use('/api/user',userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order',orderRouter)



app.listen(port, ()=> { console.log('Server is running on PORT:' +port);
    connectDB();
    
})