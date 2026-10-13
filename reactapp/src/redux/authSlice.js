import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    username: localStorage.getItem('username') || null,
    userRole: localStorage.getItem('userRole') || null,
  },
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.userRole = action.payload.userRole;

      // Persist to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('username', action.payload.username);
      localStorage.setItem('userRole', action.payload.userRole);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.username = null;
      state.userRole = null;

      // Remove from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;