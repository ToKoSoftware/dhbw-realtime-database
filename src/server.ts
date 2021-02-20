import express from 'express';
import cors from 'cors';
import {Vars} from './vars';
import {wrapResponse} from './functions/response-wrapper';
import bodyParser from 'body-parser';
import * as path from "path";
import {Server, Socket} from "socket.io";

export default async function startServer(): Promise<void> {

    /**
     * Setup
     */
    const app = express();

    const httpServer = require("http").createServer(app);
    const io = new Server(httpServer, {});


    const subscriptions: Socket[] = [];
    io.on("connection", (socket: Socket) => {
        socket.on('join', data => {
            subscriptions.push(socket);
        });
    });


    app.use(cors());
    app.use(bodyParser.json());

    const PORT: string | number = process.env.PORT || 80;
    const router = express.Router();

    app.use(router);
    app.use(express.static(path.join(__dirname, './public')));

    /**
     * Routes
     */
    app.get('/api/v1', (req, res) => res.send(wrapResponse(true, {
        systemId: 'dhbw-realtime-database'
    })));

    const stream = await Vars.r
        .db('stocks')
        .table('GME')
        .changes({includeInitial: false}).run();

    stream
        .on('data', change => {
            subscriptions.forEach(client => client.emit('refresh', {
                value: change.new_val.value,
                time: change.new_val.time,
                id: change.new_val.id,
            }));
        })
        .on('error', err => {
            console.log('ERROR', err);
        })
        .on('end', () => {
            console.log('end');
        });


    /**
     * Server
     */
    httpServer.listen(PORT, () => Vars.loggy.log(`[Server] Starting on http://localhost:${PORT}`));
}
