const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(__dirname));
app.use('/icons', express.static(path.join(__dirname, 'icons')));

// Store locations
const locations = {
  sofa: null,
  scooters: {}
};

// Single HTML endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // Admin connection
  if (socket.handshake.headers.referer?.includes('localhost')) {
    socket.emit('init', locations);
    
    socket.on('admin-location', (pos) => {
      locations.sofa = pos;
      io.emit('sofa-update', pos);
      console.log('Admin location updated:', pos);
    });

  // Delivery connection  
  } else {
    const scooterId = Object.keys(locations.scooters).length + 1;
    console.log(`New delivery connection (ID: ${scooterId})`);
    
    socket.on('scooter-location', (pos) => {
      locations.scooters[scooterId] = pos;
      io.emit('scooter-update', { id: scooterId, ...pos });
    });
    
    socket.on('disconnect', () => {
      delete locations.scooters[scooterId];
      io.emit('scooter-disconnected', scooterId);
      console.log(`Delivery ${scooterId} disconnected`);
    });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Admin: http://localhost:${PORT}`);
  console.log(`Delivery: npx ngrok http ${PORT}`);
});