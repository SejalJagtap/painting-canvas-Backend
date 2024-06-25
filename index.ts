const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const { Server, Socket } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

type Point = {
    x: number, y: number
};

type DrawLine = {
    prevPoint: Point | null,
    currentPoint: Point,
    color: string
};

let participants: { id: string, name: string }[] = [];

io.on('connection', (socket: typeof Socket) => {
    console.log("connected");

    socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLine) => {
        socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color });
    });

    socket.on('clear', () => {
        io.emit('clear');
    });

    socket.on('name', (name: string) => {
        participants.push({ id: socket.id, name });
        io.emit('participants', participants.map(participant => participant.name));
    });

    socket.on('disconnect', () => {
        participants = participants.filter(participant => participant.id !== socket.id);
        io.emit('participants', participants.map(participant => participant.name));
    });
});

server.listen(3001, () => {
    console.log("server listening on port 3001");
});
