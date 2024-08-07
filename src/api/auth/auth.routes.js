const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { addRefreshTokenToWhitelist } = require('./auth.services');
const { generateTokens } = require('../../utils/jwt');
const {
  findUserByPhone,
  createUser,
} = require('../users/users.services');

router.post('/register', async (req, res, next) => {
  try {
    const { nama, noTelp, password, provinsi, kota, kecamatan, alamat } = req.body;
    if (!noTelp || !password || !nama || !provinsi || !kota || !kecamatan || !alamat) {
      res.status(400);
      throw new Error('Semua data harus diisi');
    }

    const cleanPhoneNumber = (phoneNumber) => {
      return phoneNumber.replace(/\D/g, '');
    };

    const cleanedNoTelp = cleanPhoneNumber(noTelp);

    // Validasi nomor telepon
    if (cleanedNoTelp.length < 10 || cleanedNoTelp.length > 15) {
      res.status(400);
      throw new Error('Nomor telepon tidak memenuhi kriteria');
    }

    if (!/^\d+$/.test(cleanedNoTelp)) {
      res.status(400);
      throw new Error('Nomor telepon tidak memenuhi kriteria');
    }

    if (!cleanedNoTelp || !password || !nama || !provinsi || !kota || !kecamatan || !alamat) {
      res.status(400);
      throw new Error('Semua data harus diisi');
    }

    const existingUser = await findUserByPhone(noTelp);

    if (existingUser) {
      res.status(400);
      throw new Error('Nomor telepon sudah digunakan');
    }

    const userId = uuidv4();
    const user = await createUser({
      noTelp,
      password,
      nama,
      provinsi,
      kota,
      kecamatan,
      alamat,
      userId
    });
  
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.userId });

    res.status(201).json({
      message: 'Registrasi berhasil!',
      status: true,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    let existingUser;

    const { noTelp, password } = req.body;
    if (!noTelp || !password) {
        res.status(400);
        throw new Error('Semua data harus diisi');
    }

    existingUser = await findUserByPhone(noTelp);

    if (!existingUser) {
        res.status(403);
        throw new Error('Pengguna tidak ditemukan');
    }

    const validPassword = await bcrypt.compare(
        password,
        existingUser.password,
    );

    if (!validPassword) {
        res.status(403);
        throw new Error('Password salah');
    }

    const jti = uuidv4();

    if (existingUser) {
        const { accessToken, refreshToken } = generateTokens(existingUser, jti);
        await addRefreshTokenToWhitelist({
          jti,
          refreshToken,
          userId: existingUser.userId,
        });

        res.status(200).json({
          
          message: 'Login succeed',
          status: true,
          data: {
            userId: existingUser.userId,
            nama: existingUser.nama,
            token: accessToken,
          },
        });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
