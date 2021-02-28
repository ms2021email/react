const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);

    // NOTE: If a service does NOT handle an axios request,
    // then the following error will be encountered:
    // UnhandledPromiseRejectionWarning: Error: Request failed with status code 500

    //axios.post('http://localhost:4000/events', event);
    // NOTE: Verify that the spelling of service and port num
    // match what is listed in "kubectl get services"
    axios.post('http://posts-clusterip-srv:4000/events', event);

    // The comments service needs to handle the CommentModerated event
    //axios.post('http://localhost:4001/events', event);
    axios.post('http://comments-srv:4001/events', event);
    
    // NOTE: The query and moderation services are the only service that cares about
    // the CreateComment event.
    //axios.post('http://localhost:4002/events', event);
    axios.post('http://query-srv:4002/events', event);

    // Moderation service
    //axios.post('http://localhost:4003/events', event);
    axios.post('http://moderation-srv:4003/events', event);
    // query service also handles the CreatedUpdated event

    // NOTE: Once the Cluster IP services are created for Pods /// to communicate with each other:
    // - Replace the localhost with the name of the service


    res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
    console.log('v1 event-bus');
    console.log('Listening on 4005');
});
