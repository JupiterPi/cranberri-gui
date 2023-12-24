import {Component} from '@angular/core';
import {Project, ProjectLanguage, ProjectType} from "../../api";

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
  createProjectType: ProjectType = "simple";
  createProjectLanguage: ProjectLanguage = "kotlin";
  createProjectArduinoMode: boolean = false;

  selectProject(project: Project) {
    this.projectSelectedName = project.name;
    this.showCreateProject = false;
  }

  createProject() {
    this.showCreateProject = true;
    this.createProjectNameInput = "";
    this.createProjectType = "simple";
    this.createProjectLanguage = "kotlin";
    this.createProjectArduinoMode = false;
  }
  toggleCreateProjectType() {
    if (this.createProjectType == "simple") this.createProjectType = "full";
    else if (this.createProjectType == "full") this.createProjectType = "simple";
  }
  toggleCreateProjectLanguage() {
    if (this.createProjectLanguage == "java") this.createProjectLanguage = "kotlin";
    else if (this.createProjectLanguage == "kotlin") this.createProjectLanguage = "java";
  }
  toggleCreateProjectArduinoMode() {
    this.createProjectArduinoMode = !this.createProjectArduinoMode;
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
    const projectName = this.createProjectNameInput.replace(" ", "_");
    api.createProject(projectName, this.createProjectType, this.createProjectLanguage, this.createProjectArduinoMode)
      .then(() => {
        this.projectSelectedName = projectName;
        return this.projects.unshift({name: projectName, type: this.createProjectType, language: this.createProjectLanguage, arduinoMode: this.createProjectArduinoMode});
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
