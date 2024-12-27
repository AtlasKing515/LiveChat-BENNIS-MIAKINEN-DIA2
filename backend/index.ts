process.env.TZ = 'UTC';

import { 
    initDB,
    getChannelMessages,
    insertChannelMessage,
    resetDB,
    getStats,
} from './db/req';

import express from 'express';
import cors from 'cors';

import http from 'http';
import { Server, Socket } from "socket.io";

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

    // Route /stats pour renvoyer les statistiques
    app.get('/stats', async (req, res) => {
        try {
            const stats = await getStats();
            res.json(stats);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });

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
    
        client.on('message', ({ channel, body }) => {
            if(client.username == null) return;
    
            console.log("message", { channel, body });
            if(client.rooms.has(channel)) {
                console.log("forwarding message to channel", channel);

                const now = new Date();

                // broadcast to all clients
                client.broadcast.to(channel).emit('message', {
                    channel,
                    username: client.username,
                    body,
                    createdAt: now,
                });

                // insert into database
                insertChannelMessage(channel, { 
                    username: client.username, 
                    body,
                    createdAt: now,
                });
            }
            
        });
    
        client.on('join-channel', (data) => {
            client.join(data);    
        });

        client.on('set-username', (data) => {
            if(typeof data !== 'string' || (data.length < 1 || data.length > 36)) return;
            client.username = data;
        });

        client.on('get-messages', async ({ channel, page }, callbackFn) => {
            const messages = await getChannelMessages(channel, page);
            // reply to client
            callbackFn(messages);
        });

    });
    
    io.on('error', (err) => {
        console.log(err);
    });
    
    server.listen(8080, () => {
        console.log('Server is running on port 8080');
    });
}



run();

/* 
Propreties MESSAGES : 
- channel : string
- body: message content
*/




/**
 * INSERT chat (channelPath, username, body) VALUES ('channel1', 'user1', 'hello world');
 * SELECT * FROM chat WHERE channelPath = 'channel1';
 */