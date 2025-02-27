const authService = require('../../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(400).json({ message: 'User registration failed', error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      res.status(200).json({ message: 'User logged in successfully', user, token });
    } catch (error) {
      res.status(400).json({ message: 'User login failed', error: error.message });
    }
  }

  async getUserProfile(req, res) {
    try {
      const user = await authService.getUserProfile(req.user.id);
      res.status(200).json({ user });
    } catch (error) {
      res.status(400).json({ message: 'Failed to get user profile', error: error.message });
    }
  }
}

module.exports = AuthController;