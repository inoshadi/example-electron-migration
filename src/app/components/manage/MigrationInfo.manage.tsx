import { useState, useEffect } from "react"
import MigrateDialog from './Migrate.dialog'
import RollbackDialog from "./Rollback.dialog"

const ManageMigrationInfo = ({ name = "", updateList }: any) => {
    const [migrationInfo, setMigrationInfo] = useState<any>({})
    const [migrateArgs, setMigrateArgs] = useState<any>({})
    const [showMigrateDialog, setShowMigrateDialog] = useState<boolean>(false)
    const [rollbackArgs, setRollbackArgs] = useState<any>({})
    const [showRollbackDialog, setShowRollbackDialog] = useState<boolean>(false)

    const onCloseMe = async () => {
        setShowMigrateDialog(false)
        onShowRollbackDialog(false)
        await updateList()
        await getMigrationInfo()
    }

    const getMigrationInfo = async () => {

        const info = await window.ipcRenderer.invoke('migrate:info', name)
        setMigrationInfo(info)
    }
    useEffect(() => {
        getMigrationInfo()
    }, [])

    const onShowMigrateDialog = async (_ev: any) => {
        setShowMigrateDialog(true)
        setMigrateArgs({ title: "Migrate Confirmation" })
    }

    const onShowRollbackDialog = async (_ev: any) => {
        setShowRollbackDialog(true)
        setRollbackArgs({
            title: "Rollback Migration",
            confirm: "You are about to rollback this migration. This action is not reversible."
        })
    }


    return (
        <>
            {showMigrateDialog && <MigrateDialog name={name} args={migrateArgs} onCloseMe={onCloseMe} />}
            {showRollbackDialog && <RollbackDialog args={rollbackArgs} name={name} onCloseMe={onCloseMe} />}
            <div className="bg-base-100 shadow-sm px-2 pb-4 border-t border-base-300">
                <div className="navbar ">
                    <div className="flex-1">
                        <div className="">{name}</div>
                    </div>
                    <div className="flex-none">
                        <ul className="menu menu-horizontal px-1">
                            {Object.hasOwn(migrationInfo, 'id') && <li className="ml-2"><a className="btn-warning btn-soft btn btn-sm" onClick={onShowRollbackDialog}>Rollback</a></li>}
                            {(name && Object.hasOwn(migrationInfo, 'id')) === false && <li className="ml-2 "><a className="btn-info btn-soft btn btn-sm " onClick={onShowMigrateDialog}>Migrate</a></li>}
                        </ul>
                    </div>
                </div>
                {Object.keys(migrationInfo).length > 0 ?
                    (
                        <table className="table table-xs table-zebra">
                            <thead className="bg-info/80 text-info-content">
                                <tr>
                                    <th>Batch</th>
                                    <th>Type</th>
                                    <th>Table Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{migrationInfo.batch}</td>
                                    <td>{migrationInfo.action}</td>
                                    <td>{migrationInfo.tablename}</td>
                                </tr>
                            </tbody>
                        </table>
                    )
                    :
                    (
                        <div className="alert alert-warning alert-soft  mt-2 mx-2"><div className="text-warning-content">Migration not set.</div></div>
                    )}
            </div>
        </>
    )
}

export default ManageMigrationInfo