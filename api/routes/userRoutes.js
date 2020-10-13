const { Router } = require('express');

const router = Router();

const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.post('/signup', userController.userSignup);
router.post('/login', userController.userLogin);
router.get('/verify/:token', userController.verifyEmailToken);
router.get('/:userId', userController.getSingleUserById);
router.patch('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;
