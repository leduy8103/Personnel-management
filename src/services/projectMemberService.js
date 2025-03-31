const ProjectMember = require("../models/ProjectMember");
const notificationService = require("./notificationService");
const projectService = require("./projectService");
const { get } = require("mongoose");

const ProjectMemberService = {
  addProjectMember: async (project_id, user_id) => {
    const member = await ProjectMember.create({ project_id, user_id });
    const projectName = await projectService.getProjectNameById(project_id);
    const message = `You have been added to project "${
      projectName || "Unknown"
    }"`;
    const link = `/projects/${project_id}`;
    await notificationService.createNotification(
      user_id,
      "PROJECT_ASSIGNED",
      message,
      link
    );

    return member;
  },

  getAllMember: async () => {
    const members = await ProjectMember.findAll();
    return members;
  },

  getProjectMembers: async (project_id) => {
    const members = await ProjectMember.findAll({ where: { project_id } });
    return members;
  },

  getProjectsByMember: async (user_id) => {
    const projectMembers = await ProjectMember.findAll({ where: { user_id } });

    // Get the project IDs
    const projectIds = projectMembers.map((member) => member.project_id);

    // Get complete project data for each project using projectService
    const projectPromises = projectIds.map((projectId) =>
      projectService.getProjectById(projectId)
    );

    const projects = await Promise.all(projectPromises);

    // Filter out any null values (in case a project was deleted)
    return projects.filter((project) => project !== null);
  },

  removeMember: async (project_id, user_id) => {
    const member = await ProjectMember.findOne({
      where: { project_id, user_id },
    });
    if (!member) {
      throw new Error("Project member not found");
    }
    await member.destroy();

    // Send notification
    const projectName = await projectService.getProjectNameById(project_id);
    const message = `You have been removed from project "${
      projectName || "Unknown"
    }"`;
    const link = `/projects/${project_id}`;
    await notificationService.createNotification(
      user_id,
      "PROJECT_REMOVED",
      message,
      link
    );

    return member;
  },
};

module.exports = ProjectMemberService;
