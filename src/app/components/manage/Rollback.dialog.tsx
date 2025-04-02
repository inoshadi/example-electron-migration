
const RollbackDialog = ({
    name = "",
    args = {
        title: "",
        confirm: "",
        btnTitle: ""
    },
    onCloseMe
}: any) => {

    const onRollback = async () => {
        await window.ipcRenderer.invoke('migrate:rollback', name)
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
                    <div className="alert alert-warning mt-4">{args.confirm && args.confirm}</div>
                    <div className="card-actions justify-end mt-4">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn ml-2" onClick={onCloseMe}>Cancel</button>
                            <button className="btn btn-warning ml-2" onClick={onRollback}>{args.btnTitle ? args.btnTitle : "Rollback"}</button>
                        </form>
                    </div>
                </div>
            </dialog >
        </>
    )
}

export default RollbackDialog