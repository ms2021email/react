import React, { useState } from 'react';
import axios from 'axios';

//export default () => {
const Postcreate = () => {
  const [title, setTitle] = useState('');

  const onSubmit = async event => {
    event.preventDefault();

    // NOTE: For the ingress controller to work each route path must be unique
    //await axios.post('http://posts.com/posts', {
    await axios.post('http://posts.com/posts/create', {
      title
    });

    setTitle('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
export default Postcreate;
