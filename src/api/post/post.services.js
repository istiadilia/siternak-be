const { db } = require('../../utils/db');

function addNewPost(post) {
    console.log(post)
    return db.post.create({
        data: post
    });
}

function getAllPosts() {
    return db.post.findMany();
}

function getAllPostsByUserId(userId) {
    return db.post.findMany({
        where: {
             userId,
        }
    });
}

function getPostById(postId) {
    return db.post.findUnique({
        where: {
            postId
        }
    });
}

function updatePostById(postId, data) {
    return db.post.update({
        where: {
            postId
        },
        data
    });
}

function deletePostById(postId) {
    return db.post.delete({
        where: {
            postId
        }
    });
}

module.exports = {
    addNewPost,
    getAllPosts,
    getAllPostsByUserId,
    getPostById,
    updatePostById,
    deletePostById
}