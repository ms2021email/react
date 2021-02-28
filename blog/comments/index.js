const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
/* axios is needed for submiting events */
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    /* Send back empty array if empty */
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content, status: 'pending' });

    commentsByPostId[req.params.id] = comments;

    // This makes a call out to the Event Bus
    // NOTE: Verify that the spelling of service and port num match
    // what is listed in "kubectl get services" to replace localhost
    //await axios.post('http://localhost:4005/events', {
    // This makes a call out to the Event Bus via clusterip-srv
    await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    });

    res.status(201).send(comments);
});

// Listen for events from Event Bus service
app.post('/events', async (req, res) => {
    console.log('Received Event', req.body.type);
  
    const { type, data } = req.body;

    if (type === 'CommentModerated') {
      const { postId, id, status, content } = data;
      const comments = commentsByPostId[postId];

      const comment = comments.find(comment => {
          return comment.id === id;
      });
      comment.status = status;
      // Note: Do not need to insert the update back into the array,
      // since it is all using the same memory of the service
      //await axios.post('http://localhost:4005/events', {
      await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentUpdated',
        data: {
            id, 
            status,
            postId,
            content
        }
    });

    }

    res.send({});
  });
    
app.listen(4001, () => {
    console.log('v1 comments');
    console.log('Listening on 4001');
});
