export type UpdateInfo = {
  cranberriGuiVersion: string,
  paperVersion: string,
  pluginVersion: string,
}

export type World = {
  id: string;
  name: string;
}

export type ProjectLanguage = "kotlin" | "java"

export type Project = {
  name: string;
  language: ProjectLanguage;
}


declare global {
  const api: {
    openWindow: (route: string | null, width: number, height: number, resizable: boolean) => Promise<void>,
    close: () => Promise<void>,

    handleIsInstalled: (handler: (event: any, isInstalled: boolean) => void) => void,
    handleUpdateInfo: (handler: (event: any, updateInfo: UpdateInfo) => void) => void,

    getIsInstalled: () => Promise<boolean>,
    getUpdateInfo: () => Promise<UpdateInfo>,

    install: () => Promise<void>,
    getWorlds: () => Promise<World[]>,
    getActiveWorldId: () => Promise<string>,
    renameWorld: (id: string, name: string) => Promise<World[]>,
    archiveWorld: (id: string) => Promise<World[]>,
    getProjects: () => Promise<Project[]>,
    openProjectsFolder: () => Promise<void>,
    openProjectFolder: (projectName: String) => Promise<void>,
    createProject: (name: string, language: string) => Promise<Project>,
    startServer: (worldId: string | null) => Promise<World>,
  }
}
