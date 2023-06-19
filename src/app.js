import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import path from 'path';
import { authRouter } from './routes/auth.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { chatRouter } from './routes/chats.router.js';
import { coockieRouter } from './routes/cookies.router.js';
import { cartsHtml } from './routes/homeCarts.router.js';
import { productsHtml } from './routes/homeProducts.router.js';
import { productsRouter } from './routes/products.router.js';
import { productsRealTime } from './routes/realTimeProducts.router.js';
import { sessionRouter } from './routes/session.router.js';
import { __dirname, connectMongo, connectSocket } from './utils.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

//Socket.io webSockets
const httpServer = app.listen(port, () => {
  console.log(`🍕 App listening on port ➡️  http://localhost:${port}`);
});

/* Connet to Mongo */
connectMongo();

/* Cookies */
app.use(cookieParser());

/* Session */
app.use(
  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://maurogarrodev:Aguantela73@coderbackend.1nd8mzz.mongodb.net/ecommerce', ttl: 7200 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);

/* Api Rest JSON */
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

/* HTML Render */
app.get('/', (req, res) => {
  return res.redirect('http://localhost:8080/auth/login');
});
app.use('/products', productsHtml);
app.use('/carts', cartsHtml);
app.use('/realtimeproducts', productsRealTime);
app.use('/chat', chatRouter);
app.use('/auth', authRouter);

/* HTML Render Cookies*/
app.use('/api/cookies', coockieRouter);

/* HTML Render Session*/
app.use('/api/session', sessionRouter);

/* Config Handlebars */
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

/* Socket */
connectSocket(httpServer);

app.get('*', (req, res) => {
  return res.status(404).json({ status: 'error', message: 'No encontrado' });
});
