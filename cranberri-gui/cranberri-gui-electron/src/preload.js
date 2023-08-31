const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
    openWindow: (route, width, height, resizable) => ipcRenderer.invoke("openWindow", route, width, height, resizable),
    close: () => ipcRenderer.invoke("close"),
    
    isInstalled: () => ipcRenderer.invoke("api-isInstalled"),
    install: () => ipcRenderer.invoke("api-install"),
    getUpdateInfo: () => ipcRenderer.invoke("api-getUpdateInfo"),
    getWorlds: () => ipcRenderer.invoke("api-getWorlds", "teste1", "teste2"),
    getActiveWorldId: () => ipcRenderer.invoke("api-getActiveWorldId"),
    renameWorld: (id, name) => ipcRenderer.invoke("api-renameWorld", id, name),
    archiveWorld: (id) => ipcRenderer.invoke("api-archiveWorld", id),
    getProjects: () => ipcRenderer.invoke("api-getProjects"),
    openProjectsFolder: () => ipcRenderer.invoke("api-openProjectsFolder"),
    openProjectFolder: (projectName) => ipcRenderer.invoke("api-openProjectFolder", projectName),
    createProject: (name, language) => ipcRenderer.invoke("api-createProject", name, language),
    startServer: (worldId) => ipcRenderer.invoke("api-startServer", worldId),
})