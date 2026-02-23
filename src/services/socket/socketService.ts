import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../../config/constants';

let socket: Socket | null = null;

export const connectSocket = (userId: string): Socket => {
    if (socket?.connected) return socket;

    const baseUrl = API_CONFIG.BASE_URL?.replace('/v1/api', '') || 'http://localhost:3056';

    socket = io(baseUrl, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
    });

    socket.on('connect', () => {
        console.log('🔌 Socket connected');
        socket?.emit('join:user', userId);
    });

    socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = (): Socket | null => socket;

export const onNotification = (callback: (data: any) => void) => {
    socket?.on('notification:new', callback);
    return () => { socket?.off('notification:new', callback); };
};

export const onOrderUpdate = (callback: (data: any) => void) => {
    socket?.on('order:statusChanged', callback);
    return () => { socket?.off('order:statusChanged', callback); };
};

export default { connectSocket, disconnectSocket, getSocket, onNotification, onOrderUpdate };
