const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// axios needed for handling requests
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
/*
posts === {
    'd1': {
        id: 'p1',
        title: 'post title1',
        comments: [
            { id: 'c1', content: 'comment1' }
        ]
    },
    'd2': {
        id: 'p2',
        title: 'post title2',
        comments: [
            { id: 'c2', content: 'comment2' }
        ]
    }
}
*/

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    console.log("Post data:" + data)

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    console.log("Comment data:" + data)
    console.log("Comment content:" + content)

    const post = posts[postId]

    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    const post = posts[postId]
    const comment = post.comments.find(comment => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
    // don't need to push the updates since it is already done by
    // sharing the same memory
  }


};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  //console.log(posts);

  handleEvent(type, data);

  res.send({});

});

app.listen(4002, async () => {
    console.log('v1 query');
    console.log('Listening on 4002');

    // Handle the case that the query service was down and missed some events
    // This makes a call out to the Event Bus
    // NOTE: Verify that the spelling of service and port num match
    // what is listed in "kubectl get services" to replace localhost
    //const res = await axios.get('http://localhost:4005/events');
    // This makes a call out to the Event Bus via clusterip-srv
    const res = await axios.get('http://event-bus-srv:4005/events');

    for (let event of res.data) {
      console.log('Processing event:', event.type);

      handleEvent(event.type, event.data);
    }
});
