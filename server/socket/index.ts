import { Server, Socket } from 'socket.io';
import { getMessages } from '../controllers/message.controller';

function socketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:19000', 'http://localhost:19002'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(' connected to socket io backend', socket.id);
    socket.on('user connected', async (chatId) => {
      console.log(chatId);
      const allMessages = await getMessages(chatId);
      console.log(
        allMessages.Messages,
        '==================================================='
      );
      io.emit('getArrivalMessages', allMessages.Messages);
      //get from DB then io.emit(DBmessages)
    });
    socket.on('chat message', (msg) => {
      console.log('msg', msg);
      io.emit('sent message', msg);
    });

    socket.on('disconnect', () => {
      console.log('a user is disconnected');
    });
  });
}

export default socketServer;
