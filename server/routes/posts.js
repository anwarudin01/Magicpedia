import express from 'express';
import { getFeedPosts, getUserPosts, likePost } from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/* READ */
router.get('/', verifyToken, getFeedPosts);

// jika kita mengklik post milik teman maka akan menampilkan postingannya
router.get('/:userId/posts', verifyToken, getUserPosts);

/* UPDATE */
// Mengupdate jumlah like setiap kali postingan di like
router.patch('/:id/like', verifyToken, likePost);

export default router;
