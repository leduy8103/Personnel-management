const ProjectService = require('../../services/projectService');

class ProjectController {
    async createProject(req, res) {
        try {
          const projectData = req.body;
          projectData.manager_id = req.user.id; // Use manager_id from token
          const project = await ProjectService.createProject(projectData);
          res.status(201).json(project);
        } catch (error) {
          res.status(400).json({ message: 'Failed to create project', error: error.message });
        }
      }

    async getProjects(req, res) {
        try {
            const projects = await ProjectService.getAllProjects();
            res.status(200).json(projects);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get projects', error: error.message });
        }
    }

    async getProjectById(req, res) {
        try {
            const project = await ProjectService.getProjectById(req.params.id);
            res.status(200).json(project);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get project', error: error.message });
        }
    }

    async getProjectByName(req, res) {
        try {
            const project = await ProjectService.getProjectByName(req.body.name);
            res.status(200).json(project);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get project', error: error.message });
        }
    }

    async getProjectByManager(req, res) {
        try {
            const projects = await ProjectService.getProjectByManager(req.body.manager_id);
            res.status(200).json(projects);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get project', error: error.message });
        }
    }

    async getProjectProgress(req, res) {
        try {
            const progress = await ProjectService.getProjectProgress(req.params.id);
            res.status(200).json(progress);
        } catch (error) {
            res.status(400).json({ message: 'Failed to get project progress', error: error.message });
        }
    }

    async updateProject(req, res) {
        try {
          const projectData = req.body;
          projectData.manager_id = req.user.id; // Use manager_id from token
          const project = await ProjectService.updateProject(req.params.id, projectData);
          res.status(200).json(project);
        } catch (error) {
          res.status(400).json({ message: 'Failed to update project', error: error.message });
        }
      }

      async deleteProject(req, res) {
        try {
          await ProjectService.deleteProject(req.params.id);
          res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error) {
          res.status(400).json({ message: 'Failed to delete project', error: error.message });
        }
      }
}

module.exports = ProjectController;