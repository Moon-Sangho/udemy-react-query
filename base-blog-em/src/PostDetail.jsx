import { useMutation, useQuery } from 'react-query';

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'DELETE' }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'PATCH', data: { title: 'REACT QUERY FOREVER!!!!' } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isFetching, isError, error } = useQuery(
    ['comment', post.id],
    () => fetchComments(post.id)
  );

  const deleteMutation = useMutation((postId) => deletePost(postId));

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      {deleteMutation.isError && (
        <p style={{ color: 'red' }}>Error deleting the post!</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{ color: 'purple' }}>Deleting the post...</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: 'green' }}>Post has been deleted!</p>
      )}
      {!deleteMutation.isSuccess && (
        <>
          <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
          <button>Update title</button>
          <p>{post.body}</p>
          <h4>Comments</h4>
          {(() => {
            if (isFetching) {
              return <div>is fetching...</div>;
            }

            if (isError) {
              return <div>{error.toString()}</div>;
            }

            return data?.map((comment) => (
              <li key={comment.id}>
                {comment.email}: {comment.body}
              </li>
            ));
          })()}
        </>
      )}
    </>
  );
}
