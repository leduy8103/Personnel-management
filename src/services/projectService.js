const Project = require("../models/Project");
const Task = require("../models/Task");
const { Op } = require('sequelize');

const ProjectService = {
  createProject: async (projectData) => {
    const project = await Project.create(projectData);
    return project;
  },

  getAllProjects: async () => {
    const projects = await Project.findAll({
      where: {
        isDelete: false
      }
    });
    return projects;
  },

  getProjectByUser: async (user_id) => {
    const projects = await Project.findAll({
      where: {
        isDelete: false
      },
      include: [
        {
          model: Task,
          as: "tasks",
          where: { user_id },
        },
      ],
    });
    return projects;
  },

  getProjectById: async (id) => {
    const project = await Project.findOne({
      where: {
        id,
        isDelete: false
      }
    });
    return project;
  },

  getProjectByName: async (name) => {
    const projects = await Project.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`
        },
        isDelete: false
      }
    });
    return projects;
  },

  getProjectByManager: async (manager_id) => {
    const projects = await Project.findAll({
      where: {
        manager_id,
        isDelete: false
      }
    });
    return projects;
  },

  getProjectProgress: async (id) => {
    const project = await Project.findOne({
      where: {
        id,
        isDelete: false
      },
      include: [
        {
          model: Task,
          as: "tasks",
        },
      ],
    });
    if (!project) {
      throw new Error("Project not found");
    }
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const progress =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    return progress;
  },

  updateProject: async (id, projectData) => {
    const project = await Project.findOne({
      where: {
        id,
        isDelete: false
      }
    });
    if (!project) {
      throw new Error("Project not found");
    }
    Object.assign(project, projectData);
    await project.save();
    return project;
  },

  deleteProject: async (id) => {
    const project = await Project.findByPk(id);
    if (!project) {
      throw new Error("Project not found");
    }
    project.isDelete = true; 
    await project.save();
    return project;
  },
};

module.exports = ProjectService;