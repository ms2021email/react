const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

// cors needed for frontend work
const cors = require('cors');
// axios needed for handling requests
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// NOTE: This POST path is similar to query functionality, which replaces this request type
// This POST GET functionality is no longer needed.  It was just used for testing.
//app.get('/posts', (req, res) => {
//    res.send(posts);
//});

// NOTE: This POST path is for create and MUST be unique in order for the ingress controller
// routing rules to work
app.post('/posts/create', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    // This makes a call out to the Event Bus
    // NOTE: Verify that the spelling of service and port num match
    // what is listed in "kubectl get services" to replace localhost
    // await axios.post('http://localhost:4005/events', {
    // This makes a call out to the Event Bus via clusterip-srv
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'PostCreated',
      data: {
          id, 
          title
      }
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  res.send({});
});

app.listen(4000, () => {
    console.log('Skaffold: v5 from repository');
    console.log('Listening on 4000');
});

