const {
  getPaginatedPosts,
  getUsers,
  getTodosByUser,
} = require("../services/externalApi.service.js");

const getTodos = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await getTodosByUser(userId);

    if (result.totalTodos === 0) {
      return res.status(200).json({
        message: "No todos found for your user",
      });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUsersController = async (req, res) => {
  try {
    const users = await getUsers();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await getPaginatedPosts();

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getTodos, getPosts, getUsersController };
