const userService = require('../../services/userService');

class UserConroller {
    async getUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get users', error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get user', error: error.message });
        }
    }

    async getUserByEmail(req, res) {
        try {
            const user = await userService.getUserByEmail(req.body.email);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get user', error: error.message });
        }
    }

    async getUserByRole(req, res) {
        try {
            const users = await userService.getUserByRole(req.body.role);
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get user', error: error.message });
        }
    }

    async getUserByStatus(req, res) {
        try {
            const users = await userService.getUserByStatus(req.body.status);
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get user', error: error.message });
        }
    }

    async getUserByDepartment(req, res) {
        try {
            const users = await userService.getUserByDepartment(req.body.department);
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get user', error: error.message });
        }
    }

    async getUserByPosition(req, res) {
        try {
            const users = await userService.getUserByPosition(req.body.position);
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get user', error: error.message });
        }
    }

    async getUserByMultipleFields(req, res) {
        try {
            const users = await userService.getUserByMultipleFields(req.body.fields);
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get user', error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: 'Failed to update user', error: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            await userService.deleteUser(req.params.id);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: 'Failed to delete user', error: error.message });
        }
    }

    async uploadUserFile(req, res) {
        try {
            const userId = req.params.id;
            const file = req.file; // Assuming you're using multer for file uploads
            const fileData = await userService.uploadFile(userId, file);
            res.status(200).json(fileData);
        } catch (error) {
            res.status(400).json({ message: 'Failed to upload file', error: error.message });
        }
    }
}

module.exports = UserConroller;