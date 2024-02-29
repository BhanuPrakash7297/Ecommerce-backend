

import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import express from 'express';

import connectDB from './config/db.js';
import morgan from 'morgan';
import authRoute from './routes/authRoute.js'

import categoryRoute from './routes/categoryRoute.js'
import productRoute from './routes/product_Routes.js'

import cors from 'cors'
import { Server as socketIo } from 'socket.io'
import http from 'http'





console.log("merchan id", process.env.BRAINTREE_MERCHANT_ID, process.env.BRAINTREE_PUBLIC_KEY,
    process.env.BRAINTREE_PRIVATE_KEY);


connectDB();

const app = express();


const server = http.createServer(app);

const users = {}

// midlerwares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use((req, res, next) => {
    req.users = users
    next()
});


// routes

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION ERR SHUTTING DOWN....');
    process.exit();
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);
const port = process.env.PORT || 5000;


server.listen(port, () => {
    console.log(` app running on ${port}`);
});


const io = new socketIo(server, {
    cors: {
        origin: true,
        credentials: true,
    },
    allowEIO3: true,
});

io.on('connection', (socket) => {



    socket.on('joinRoom', (data) => {
        // Join a room based on the user's ID
        console.log(":JOoindfjdlfj rodnkfjkldjlfkldjfdfldf", data)
        socket.join(data.userId);
        users[data.userId] = socket
        // socket.join(data.id);
    });

});





process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLER REJECTION SHUTTING DOWN....')
    server.close(() => {
        process.exit(1);
    })
})
export default io;
