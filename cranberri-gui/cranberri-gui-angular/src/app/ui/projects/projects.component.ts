import {Component} from '@angular/core';
import {Project} from "../../api";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['../worlds_projects.scss']
})
export class ProjectsComponent {
  constructor() {
    (async () => {
      this.projects = await api.getProjects();
    })();
  }

  projects: Project[] = [];
  projectSelectedName: string | null = null;

  showCreateProject = false;
  createProjectNameInput = "";
  createProjectLanguage = "kotlin";

  selectProject(project: Project) {
    this.projectSelectedName = project.name;
    this.showCreateProject = false;
  }

  createProject() {
    this.showCreateProject = true;
    this.createProjectNameInput = "";
    this.createProjectLanguage = "kotlin";
  }
  toggleCreateProjectLanguage() {
    if (this.createProjectLanguage == "java") this.createProjectLanguage = "kotlin";
    else if (this.createProjectLanguage == "kotlin") this.createProjectLanguage = "java";
  }
  confirmCreateProjectAllowed() {
    let allowed = true;
    this.projects.forEach(project => {
      if (project.name == this.createProjectNameInput) allowed = false;
    });
    return allowed;
  }
  confirmCreateProject() {
    this.showCreateProject = false;
    if (this.createProjectNameInput == "") return;
    api.createProject(this.createProjectNameInput.replace(" ", "_"), this.createProjectLanguage)
      .then(project => {
        this.projectSelectedName = project.name;
        return this.projects.unshift(project);
      });
  }

  openProjectsFolder() {
    api.openProjectsFolder();
  }

  openProjectFolder() {
    if (this.projectSelectedName == null) return;
    api.openProjectFolder(this.projectSelectedName);
  }
}
