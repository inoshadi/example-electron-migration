
const DropTableDialog = ({ onCloseMe, args = {} }: any) => {
    const onDropTableMigration = async (_ev: any) => {
        const response = await window.ipcRenderer.invoke('manage:drop-table', args.tablename, true)
        console.log(response)
        location.reload()
    }
    const onDropTable = async (_ev: any) => {
        await window.ipcRenderer.invoke('manage:drop-table', args.tablename)
        onCloseMe()
    }
    return (
        <>
            <dialog className="modal" open>
                <div className="modal-box bg-stone text-ghost-content glass">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button onClick={onCloseMe} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">{args.title && args.title}</h3>
                    <p className="py-4" dangerouslySetInnerHTML={{ __html: args.confirm && args.confirm }}></p>

                    <div className="card-actions justify-end">
                        <button className="btn  btn-info" onClick={onDropTableMigration}>Drop and Remove Migration</button>
                        <button className="btn  btn-warning" onClick={onDropTable}>Drop Only</button>

                    </div>
                </div>
            </dialog >
        </>
    )
}
export default DropTableDialog