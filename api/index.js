import express from'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'
import cookieparser from 'cookie-parser'
import postRoutes from './routes/post.js'
import commentRoutes from './routes/comment.js'
import path from 'path';
dotenv.config();
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('MongoDb is connected');
    
})
.catch((error)=>{
    console.log(error);
    
})
const __dirname = path.resolve();
const app = express()

app.use(express.json())
app.use(cookieparser())

app.listen(3000,()=>{
    console.log('server is running on port 3000');
    
})
app.use('/api/user',userRoutes);
app.use('/api/auth',authRoute);
app.use('/api/post',postRoutes)
app.use('/api/comment',commentRoutes)

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    })
})