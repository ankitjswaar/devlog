import { useState, useCallback } from 'react';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const setPostsData = useCallback((data) => {
    setPosts(data);
  }, []);

  return { posts, loading, setLoading, setPosts: setPostsData };
};

export default usePosts;
