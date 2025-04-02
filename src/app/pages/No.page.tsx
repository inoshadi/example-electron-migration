function NoPage() {
    window.ipcRenderer.send('win:resize', { width: 800, height: 600 })
    return <h1>404</h1>;
};

export default NoPage