declare var require: any
const express = require('express');
const http = require('http')

const app = express()

const server = http.createServer(app)

const { Server } = require('socket.io');


const io = new Server(server, {
    cors: {
        origin: '*',
    }
})

type Point = {
    x: number, y: number
}

type DrawLine = {
    prevPoint: Point | null
    currentPoint: Point
    color: string
}

io.on('connection', (socket) => {
    console.log("connected")
    socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLine) => {
        socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color })
    })
    socket.on('clear', () => {
        io.emit('clear')
    })
})

server.listen(3001, () => {
    console.log("server listening on port 3001")
})