const express = require('express');
const { registerUser, loginUser, getMe, getUsers, deleteUser, updateProfile, changePassword, forceCreateAdmin, seedDatabase } = require('../controllers/authController');


const { getUserActivity } = require('../controllers/interactionController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.get('/setup-admin', forceCreateAdmin);
router.get('/seed-db', seedDatabase);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/activity', protect, getUserActivity);


router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);


module.exports = router;

