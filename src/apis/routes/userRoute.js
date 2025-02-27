const express = require('express'); 
const multer = require('multer');
const router = express.Router();
const UserController = require('../controllers/userController');

const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

const userController = new UserController();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.get('/email/:email', userController.getUserByEmail);
router.get('/role/:role', userController.getUserByRole);
router.get('/status/:status', userController.getUserByStatus);
router.get('/department/:department', userController.getUserByDepartment);
router.get('/position/:position', userController.getUserByPosition);
router.get('/fields', userController.getUserByMultipleFields);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/:id/upload', upload.single('file'), userController.uploadUserFile);

module.exports = router;