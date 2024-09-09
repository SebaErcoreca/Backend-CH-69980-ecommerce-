import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { engine } from 'express-handlebars';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import viewsRouter from './routes/views.routes.js';
import prodsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import userRouter from './routes/users.routes.js'
import authRoutes from './routes/auth.routes.js';
import protectedRouter from './routes/protected.routes.js';
import { productManager } from './daos/productsDAO.js';
import currentUser from './middleware/currentUser.js'
import mongoose from 'mongoose';
import './utils/passport.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const hbs = engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/', viewsRouter);
app.use('/api/products', prodsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/user', userRouter);
app.use('/api/sessions', authRoutes);
app.use('/api', currentUser, protectedRouter);

server.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});

const io = new SocketServer(server);

io.on('connection', (socket) => {
    console.log(`New connected client: ${socket.id}`);
    socket.on('createProduct', async (data) => {
        try {
            console.log(data.stock);
            const product = await productManager.addProduct(data.title, data.description, data.price, data.thumbnail, data.code, data.stock);
            io.emit('productCreated', { message: 'Product created', product });
        } catch (error) {
            socket.emit('productError', { message: error.message });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Cliente disconnected: ${socket.id}`);
    });

    socket.on('error', (error) => {
        console.error('Error:', error);
    });
});

mongoose.connect('mongodb+srv://user0:<db_password>@ecommerce-backend-proje.2h9ioq8.mongodb.net/', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});