const { PostRepository } = require("../repositories/PostsRepository");

const postRepository = new PostRepository();

async function getPosts(request, response) {
  const posts = await postRepository.findAll();

  if (!posts.length) {
    return response.status(404).json("There are no registered posts.");
  }

  return response.status(200).json(posts);
}

async function createPost(request, response) {
  const { title, cover, description } = request.body;

  const post = await postRepository.insert({ title, cover, description });

  return response.status(200).json(post);
}

async function deletePost(request, response) {
  const { id } = request.params;

  const post = await postRepository.get(id);

  if (post) {
    return response
      .status(400)
      .json("You are not allowed to proceed with this action.");
  }

  await postRepository.delete(id);

  return response.status(200).json("Post successfully deleted.");
}

async function updatePost(request, response) {
  const { id } = request.params;

  const post = await postRepository.get(id);

  if (!post) {
    return response.status(404).json("Post not found.");
  }

  const { title, cover, description } = request.body;

  const postToUpdate = await postRepository.insert({
    title,
    cover,
    description,
  });

  return response.status(200).json(postToUpdate);
}

module.exports = {
  getPosts,
  createPost,
  deletePost,
  updatePost,
};
