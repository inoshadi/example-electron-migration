const Anchor = ({ link = "", title = "" }: any) => {

    const onOpenExternal = () => {
        window.ipcRenderer.send("win:open-external", link)
    }

    return <a className="btn-link cursor-pointer" onClick={onOpenExternal}>{title}</a>
}

export default Anchor