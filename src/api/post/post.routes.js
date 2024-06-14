const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { isAuthenticated } = require('../../middleware/middleware');
const router = express.Router();

const { 
    addNewPost, 
    getAllPosts,
    getAllPostsByUserId,
    getPostById,
    updatePostById,
    deletePostById
} = require('./post.services');

router.post('/', isAuthenticated, async (req, res, next) => {
    try {
        const { userId } = req.payload;
        const { jenisTernak, jenisAksi, keterangan, longitude, latitude } = req.body;
        if (!jenisTernak || !jenisAksi) {
            res.status(400);
            throw new Error('Semua data harus diisi');
        }

        if (!latitude || !longitude) {
            res.status(400);
            throw new Error('Lokasi tidak dapat diambil');
        }

        if (!userId) {
            res.status(400);
            throw new Error('Pengguna tidak ditemukan');
        }

        const postId = uuidv4();
        const petugas = 'Default';
        const status = 'Menunggu';

        console.log({
            jenisTernak,
            jenisAksi,
            keterangan,
            latitude,
            longitude
        });

        const post = await addNewPost({
            postId,
            userId,
            jenisTernak,
            jenisAksi,
            keterangan,
            latitude,
            longitude,
            petugas,
            status,
        });
        
        res.status(201).json({
            message: 'Post success',
            status: true,
            data: {
                postId: post.postId,
            },
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/myposts', isAuthenticated, async (req, res, next) => {
    try {
        const { userId } = req.payload;
        const posts = await getAllPostsByUserId(userId);
        res.status(200).json({
            message: 'Berhasil menampilkan post milik user',
            status: true,
            data: {
                posts,
            }, 
        });
    } catch (err) {
        next(err);
    }
});

router.get('/:postId', isAuthenticated, async (req, res, next) => {
    try {
        const { postId } = req.params;
        const post = await getPostById(postId);
        res.status(200).json({
            message: 'Berhasil mengambil post',
            status: true,
            data: post,
            
        });
    } catch (err) {
        next(err);
    }
});

router.put('/:postId', isAuthenticated, async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { jenisTernak, jenisAksi, keterangan, longitude, latitude } = req.body;
        if (!jenisTernak || !jenisAksi) {
            res.status(400);
            throw new Error('Semua data harus diisi');
        }

        const postNow = await getPostById(postId);

        if (postNow.userId !== req.userId) {
            res.status(403);
            throw new Error('Tidak diizinkan untuk mengubah post orang lain');
        }

        const post = await updatePostById(postId, {
            jenisTernak,
            jenisAksi,
            keterangan,
            latitude,
            longitude,
        });

        res.status(200).json({
            message: 'Berhasil mengubah post',
            status: true,
            data: {
                postId: post.postId,
                jenisTernak: post.jenisTernak,
                jenisAksi: post.jenisAksi,
                keterangan: post.keterangan,
                latitude: post.latitude,
                longitude: post.longitude,
            },
            
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/:postId', isAuthenticated, async (req, res, next) => {
    try {
        const { postId } = req.params;

        const postNow = await getPostById(postId);

        if (postNow.userId !== req.userId) {
            res.status(403);
            throw new Error('Tidak diizinkan untuk menghapus post orang lain');
        }

        const post = await deletePostById(postId);
        res.status(200).json({
            message: 'Berhasil menghapus post',
            status: true,
        });
    } catch (err) {
        next(err);
    }
});



router.get('/', isAuthenticated, async (req, res, next) => {
    try {
        const posts = await getAllPosts();
        res.status(200).json({
            message: 'Berhasil mengambil semua post',
            status: true,
            data: posts,
            
        });
    } catch (err) {
        next(err);
    }
});



module.exports = router;