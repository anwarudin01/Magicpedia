// Tempat menyimpan semua global state

import { createSlice } from '@reduxjs/toolkit';

// Data ini akan di akses di seluruh aplikasi kita
// Jadi kita bisa gunakan ini dimanapun kita mau
const initialState = {
  // untuk represent dork mode & light mode
  mode: 'light',
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action untuk mengubah dark mode ke light mode dan sebaliknya
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    // Action untuk mengubah state user dan token ketika login (sesuai user yang login)
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    // Action untuk mengubah kembali state user & token ke null (menghapus user & token yang ada)
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    // Action untuk menambah teman
    setFriends: (state, action) => {
      // Jika user sudah ada
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error('user friends non-existent :(');
      }
    },
    // Action ketika kita membuat postingan
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    // Action untuk mengedit postingan yang sudah ada
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;
