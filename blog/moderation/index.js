const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// receives event from Broker
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    console.log(data.content);
    console.log(status);
   
    // This makes a call out to the Event Bus
    // NOTE: Verify that the spelling of service and port num match
    // what is listed in "kubectl get services" to replace localhost
    //await axios.post('http://localhost:4005/events', {
    // This makes a call out to the Event Bus via clusterip-srv
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data: {
          id: data.id,
          postId: data.postId,
          status: status,
          content: data.content
      }
    });  
  }

  res.send({});
});

app.listen(4003, () => {
    console.log('v1 moderation');
    console.log('Listening on 4003');
});
