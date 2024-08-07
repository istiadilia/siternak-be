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
        const { jenisTernak, jumlahTernak, jenisAksi, keteranganAksi, alamatAksi, longitude, latitude } = req.body;
        if (!jenisTernak || !jenisAksi || !keteranganAksi || !alamatAksi) {
            res.status(400);
            console.log(req.body);
            throw new Error('Semua data wajib diisi!');
        }

        if (!latitude || !longitude) {
            res.status(400);
            throw new Error('Lokasi tidak dapat diambil. Beri izin akses lokasi atau cek kembali koneksi internet Anda.');
        }

        if (!userId) {
            res.status(400);
            throw new Error('Pengguna tidak ditemukan');
        }

        const postId = uuidv4();
        const petugas = 'Default';
        const status = 'Menunggu';

        const post = await addNewPost({
            postId,
            userId,
            jenisTernak,
            jumlahTernak,
            jenisAksi,
            keteranganAksi,
            alamatAksi,
            latitude,
            longitude,
            petugas,
            status,
        });
        
        res.status(201).json({
            message: 'Laporan berhasil ditambahkan',
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
            message: 'Berhasil menampilkan laporan milik pengguna',
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
            message: 'Berhasil mengambil laporan',
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
        const { jenisTernak, jumlahTernak, jenisAksi, keteranganAksi, alamatAksi, longitude, latitude } = req.body;
        if (!jenisTernak || !jumlahTernak || !jenisAksi || !keteranganAksi || !alamatAksi) {
            res.status(400);
            throw new Error('Semua data harus diisi!');
        }

        const postNow = await getPostById(postId);

        if (postNow.userId !== req.userId) {
            res.status(403);
            throw new Error('Tidak diizinkan untuk mengubah laporan orang lain');
        }

        const post = await updatePostById(postId, {
            jenisTernak,
            jumlahTernak,
            jenisAksi,
            keteranganAksi,
            alamatAksi,
            latitude,
            longitude,
        });

        res.status(200).json({
            message: 'Berhasil mengubah laporan',
            status: true,
            data: {
                postId: post.postId,
                jenisTernak: post.jenisTernak,
                jumlahTernak: post.jumlahTernak,
                jenisAksi: post.jenisAksi,
                keteranganAksi: post.keteranganAksi,
                alamatAksi: post.alamatAksi,
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
            throw new Error('Tidak diizinkan untuk menghapus laporan orang lain');
        }

        const post = await deletePostById(postId);
        res.status(200).json({
            message: 'Berhasil menghapus laporan',
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
            message: 'Berhasil mengambil semua laporan',
            status: true,
            data: posts,
            
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;