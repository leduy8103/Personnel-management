const TaskService = require('../../services/taskService');

class TaskController {
    async createTask(req, res) {
        try {
            const taskData = req.body;
            const task = await TaskService.createTask(taskData);
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ message: 'Failed to create task', error: error.message });
        }
    }

    async assignTask(req, res) {
        try {
            const task_id = req.params.id;
            const { user_id } = req.body;
            const task = await TaskService.assignTask(task_id, user_id);
            res.status(200).json(task);
        } catch (error) {
            res.status(400).json({ message: 'Failed to assign task', error: error.message });
        }
    }

    async updateTaskStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const task = await TaskService.updateTaskStatus(id, status);
            res.status(200).json(task);
        } catch (error) {
            res.status(400).json({ message: 'Failed to update task status', error: error.message });
        }
    }

    async updateTaskPriority(req, res) {
        try {
            const { id } = req.params;
            const { priority } = req.body;
            const task = await TaskService.updateTaskPriority(id, priority);
            res.status(200).json(task);
        } catch (error) {
            res.status(400).json({ message: 'Failed to update task priority', error: error.message });
        }
    }

    async getTasks(req, res) {
        try {
            const tasks = await TaskService.getAllTasks();
            res.status(200).json(tasks);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get tasks', error: error.message });
        }
    }

    async getTaskById(req, res) {
        try {
            const { id } = req.params;
            const task = await TaskService.getTaskById(id);
            res.status(200).json(task);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get task', error: error.message });
        }
    }

    async getTasksByProject(req, res) {
        try {
            const { project_id } = req.params;
            const tasks = await TaskService.getTasksByProject(project_id);
            res.status(200).json(tasks);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get tasks', error: error.message });
        }
    }

    async getTasksByUser(req, res) {
        try {
            const { user_id } = req.params;
            const tasks = await TaskService.getTasksByUser(user_id);
            res.status(200).json(tasks);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get tasks', error: error.message });
        }
    }

    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const taskData = req.body;
            const task = await TaskService.updateTask(id, taskData);
            res.status(200).json(task);
        } catch (error) {
            res.status(400).json({ message: 'Failed to update task', error: error.message });
        }
    }

    async deleteTask(req, res) {
        try {
            const { id } = req.params;
            await TaskService.deleteTask(id);
            res.status(204).end();
        } catch (error) {   
            res.status(400).json({ message: 'Failed to delete task', error: error.message });
        }
    }
}

module.exports = TaskController;