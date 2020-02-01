const express = require('express');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');


const PostsController = require('../controllers/posts');

const router = express.Router();


router.post("", checkAuth, extractFile, PostsController.createPost);

router.put("/:id", checkAuth, extractFile, PostsController.updatePost);

// we can also use router.get instead of use

router.get('', PostsController.fetchAllPosts);


router.get('/:id', PostsController.fetchById);


router.delete("/:id", checkAuth, PostsController.deletePost );

module.exports = router;
