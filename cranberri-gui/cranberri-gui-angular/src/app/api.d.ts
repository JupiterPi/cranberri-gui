export type UpdateInfo = {
  cranberriGuiVersion: string,
  paperVersion: string,
  pluginVersion: string,
}

export type World = {
  id: string;
  name: string;
}

export type ProjectType = "simple" | "full"
export type ProjectLanguage = "kotlin" | "java"

export type Project = {
  name: string;
  type: ProjectType;
  language: ProjectLanguage;
}

export type FolderId = "server" | "projects" | "worlds_archive";


declare global {
  const api: {
    openWindow: (route: string | null, width: number, height: number, resizable: boolean) => Promise<void>,
    close: () => Promise<void>,

    handleIsInstalled: (handler: (event: any, isInstalled: boolean) => void) => void,
    handleUpdateInfo: (handler: (event: any, updateInfo: UpdateInfo) => void) => void,

    getIsInstalled: () => Promise<boolean>,
    getUpdateInfo: () => Promise<UpdateInfo>,

    install: () => Promise<void>,
    updatePlugin: () => Promise<void>,
    getWorlds: () => Promise<World[]>,
    getActiveWorldId: () => Promise<string>,
    renameWorld: (id: string, name: string) => Promise<World[]>,
    archiveWorld: (id: string) => Promise<World[]>,
    getProjects: () => Promise<Project[]>,
    openProjectsFolder: () => Promise<void>,
    openProjectFolder: (projectName: String) => Promise<void>,
    openOtherFolder: (folderId: FolderId) => Promise<void>,
    createProject: (name: string, type: ProjectType, language: ProjectLanguage) => Promise<void>,
    startServer: (worldId: string | null) => Promise<World>,
  }
}
