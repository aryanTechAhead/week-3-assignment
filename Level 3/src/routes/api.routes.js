const express = require("express");

const router = express.Router();

const { getTodos, getPosts, getUsersController } = require("../controllers/api.controller");


/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Returns a list of dummy users from the application.
 *     responses:
 *       200:
 *         description: A successful response containing user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get("/todos/:userId", getTodos);

router.get("/users", getUsersController);

router.get("/posts", getPosts);

module.exports = router;
