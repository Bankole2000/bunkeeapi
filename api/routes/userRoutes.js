const { Router } = require('express');

const router = Router();

const userController = require('../controllers/userController');
const {
  requireUserAuth,
  requireAgentAuth,
  requireUserSelfAuth,
} = require('../middleware/authMiddleware');

router.get('/', userController.getAllUsers);
router.post('/signup', userController.userSignup);
router.post('/login', userController.userLogin);
router.get('/verify/:token', userController.verifyEmailToken);
router.get('/:userId', userController.getSingleUserById);
router.patch('/:userId', requireUserSelfAuth, userController.updateUser);
router.delete('/:userId', requireUserSelfAuth, userController.deleteUser);

module.exports = router;
