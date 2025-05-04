import { io } from 'socket.io-client';
import { getSession } from '../utils/get-session';

export const socket = io('http://localhost:80', {
  withCredentials: true,
  extraHeaders: {
    Authorization: `Bearer ${getSession().token}`,
  },
});
