
const MigrateDialog = ({
    name = "",
    args = {
        title: "",
        confirm: "",
        btnTitle: ""
    },
    onCloseMe
}: any) => {

    const onMigrate = async () => {
        await window.ipcRenderer.invoke('migrate', name)
        await onCloseMe()
    }

    return (
        <>
            <dialog className="modal" open>
                <div className="modal-box bg-stone text-ghost-content glass">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button onClick={onCloseMe} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">{args.title && args.title}: {name}</h3>
                    <p className="py-4" dangerouslySetInnerHTML={{ __html: args.confirm && args.confirm }}></p>

                    <div className="card-actions justify-end">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn ml-2" onClick={onCloseMe}>Cancel</button>
                            <button className="btn btn-info ml-2" onClick={onMigrate}>{args.btnTitle ? args.btnTitle : "Migrate"}</button>
                        </form>
                    </div>
                </div>
            </dialog >
        </>
    )
}

export default MigrateDialog