const express = require('express');
const db = require('./data/db.js');

const server = express();

server.use(express.json()); // Add this to make post and put work

server.get('/', (req, res) => {
  res.send('N O')
})

server.get('/now', (req, res) => {
  res.send(`${new Date().toLocaleString()}`)
})

server.get('/hubs', (req, res) => {
  db.hubs.find()
  .then(hubs => {
    // 200-299 success
    // 300-399 redirects
    // 400-499 client error
    // 500-599 server error
    res.status(200).json(hubs);
  })
  .catch(err => {
    res.status(500).json({ message: 'Error retrieving hubs'})
  })
})

server.post('/hubs', (req, res) => {
  // read the data for the hub
  const hubInfo = req.body;
  // add the hub to our db
  db.hubs.add(hubInfo).then(hub => {
    res.status(201).json(hub)
  })
  .catch(err => {
    res.status(501).json({ message: 'Error posting hubs'})
  })
})

server.delete('/hubs/:id', (req, res) => {
  const id = req.params.id;
  db.hubs.remove(id)
  .then(deleted => {
    res.status(204).end();
  })
  .catch(err => {
    res.status(500).json({ message: 'Error deleting hub'})
  })
})

server.put('/hubs/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db.hubs.update(id, changes)
  .then(updated => {
    if (updated) {
      res.status(200).json(updated)
    } else {
      res.status(404).json({ message: 'Hub not found'})
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Error'})
  })
})

server.listen(5000, () => {
  console.log('API up and running on port 5000')
})
