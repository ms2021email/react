import React from 'react';
import PostCreate from './PostCreate';
import PostList from './PostList';

const postcreate = () => {
  return (
    <div className="container">
      <h1>Skaffold: Create Post!test</h1>
      <PostCreate />
      <hr />
      <h1>Posts</h1>
      <PostList />
    </div>
  );
};
export default postcreate;
