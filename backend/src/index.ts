process.env.TZ = 'UTC';

import { 
    initDB,
    getChannelMessages,
    insertChannelMessage,
    resetDB,
    getStats,
} from './lib/db/req';

import express from 'express';
import cors from 'cors';

import http from 'http';
import { Server, Socket } from "socket.io";
import swaggerRouter from './lib/swagger';
import postgres from 'postgres';
import { Message } from './lib/api/message';

async function run() {
    console.log("Running server", new Date());

    await initDB();

    runServer();
}

interface SocketClient extends Socket {
    username: string | null;
}

function runServer() {
    const app = express();
    app.use(cors());

    /**
     * Retrieves chat statistics from the database, including the top channels
     * by message count and a timeline of messages per day for each channel.
     *
     * @swagger
     * /stats:
     *   get:
     *     summary: Retrieve chat statistics
     *     description: This endpoint provides an overview of chat activity, including the most active channels and a timeline of message counts.
     *     responses:
     *       200:
     *         description: Returns a JSON object containing chat statistics
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 topChannels:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       channel:
     *                         type: string
     *                       total_messages:
     *                         type: number
     *                 timeline:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       channel:
     *                         type: string
     *                       day:
     *                         type: string
     *                         format: date-time
     *                       message_count:
     *                         type: number
     *
     * @returns An object with two arrays: `topChannels` and `timeline`.
     */
    app.get('/stats', async (req, res) => {
        try {
            const stats = await getStats();
            res.json(stats);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });

    // API Swagger /api-docs
    app.use('/api-docs', swaggerRouter);

    const server = http.createServer(app);
    const io = new Server(server);

    io.on('connection', (client: SocketClient) => {
        client.username = null;
    
        console.log('connection');
    
        client.on('event', data => {
            console.log(data);
        });
    
        client.on('disconnect', () => { 
            console.log('disconnect');
        });
    
        client.on('message', ({ channel, body }: Message) => {
            if(client.username == null) return;
    
            console.log("message", { channel, body });
            if(client.rooms.has(channel)) {
                console.log("forwarding message to channel", channel);

                const now = new Date();

                const message = {
                    channel,
                    username: client.username,
                    body,
                    createdAt: now,
                };

                // broadcast to all clients
                client.broadcast.to(channel).emit('message', message);

                // insert into database
                insertChannelMessage(message);
            }
            
        });
    
        client.on('join-channel', (data: string) => {
            client.join(data);    
        });

        client.on('set-username', (data: string) => {
            if(typeof data !== 'string' || (data.length < 1 || data.length > 36)) return;
            client.username = data;
        });

        client.on('get-messages', async ({ channel, page } : { channel: string, page: number}, callbackFn: (res: postgres.RowList<postgres.Row[]>) => void) => {
            const messages = await getChannelMessages(channel, page);
            // reply to client
            if(callbackFn) callbackFn(messages);
        });

    });
    
    io.on('error', (err: Error) => {
        console.log(err);
    });
    
    server.listen(8080, () => {
        console.log('Server is running on port 8080');
    });
}

run();