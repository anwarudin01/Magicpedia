import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';

// 2 dibawah ini untuk setting path ke direktori tertentu
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from './middleware/auth.js';
import User from './models/User.js';
import Post from './models/Post.js';
import { users, posts } from './data/index.js';

// -- CONFIGURATION --

// Untuk mengambil fileUrl
const __filename = fileURLToPath(import.meta.url);
// hanya ketika menggunakan type module
const __dirname = path.dirname(__filename);

// untuk bisa menggunakan dotenv file
dotenv.config();

// invoke express aplikasi agar bisa menggunakan middleware
const app = express();

// gunakan middelwarenya disini
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extends: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
// Cross Origin Resources Sharing Policies
app.use(cors());
// Set direktori dimana kita menyimpan assets kita dalam hal ini adalah gambar yang akan kita simpan di folder public/assets (lokal)
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

//-- SET UP FILE STOREGE --
// ketika kita upload file di website ini maka destinasinya akan di save pada public/assets
// fungsi ini bisa di lihat pada github multer reponya
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ROUTES WITH FILE
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('picture'), createPost);

// ROUTES
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// -- MONGOOSE SET UP --
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // Inject data agar app terisi beberapa user
    // lakukan ini hanya sekali
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
