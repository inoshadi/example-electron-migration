import { useState } from "react"
import ManageMigrationInfo from "./MigrationInfo.manage"
import RollbackDialog from "./Rollback.dialog"
import MigrateDialog from './Migrate.dialog'

const ManageMigration = ({ migrationList = [], updateList }: any) => {

    const [migrateArgs, setMigrateArgs] = useState<any>({})
    const [showMigrateDialog, setShowMigrateDialog] = useState<boolean>(false)
    const [rollbackArgs, setRollbackArgs] = useState<any>({})
    const [showRollbackDialog, setShowRollbackDialog] = useState<boolean>(false)

    const onShowMigrateDialog = async (_ev: any) => {
        setShowMigrateDialog(true)
        setMigrateArgs({
            title: "Migrate Confirmation",
            confirm: "You are about to running all unexecuted entries.",
            btnTitle: "Migrate All"
        })
    }

    const onShowRollbackDialog = async (_ev: any) => {
        setShowRollbackDialog(true)
        setRollbackArgs({
            title: "Rollback Last Batch",
            confirm: "You are about to rollback the latest batch. This action is not reversible."
        })
    }

    const onCloseMe = async () => {
        setShowRollbackDialog(false)
        onShowMigrateDialog(false)
        updateList()
    }

    return (
        <>
            {showMigrateDialog && <MigrateDialog name="" args={migrateArgs} onCloseMe={onCloseMe} />}
            {showRollbackDialog && <RollbackDialog args={rollbackArgs} name="" onCloseMe={onCloseMe} />}
            <div className="">
                <div className="navbar bg-base-100 shadow-sm">
                    <div className="navbar-start">

                        <a className=" text-xl">Migration List</a>
                    </div>

                    <div className="navbar-end">
                        <a className="btn ml-2" onClick={onShowRollbackDialog}>Rollback Last Batch</a>
                        <a className="btn btn-primary btn-soft ml-2" onClick={onShowMigrateDialog}>Migrate All Latest</a>
                    </div>
                </div>
                {migrationList && migrationList.map((name: any, key: number) => {
                    return (
                        <ManageMigrationInfo name={name} key={name + key} updateList={updateList} />
                    )
                })}
            </div>
        </>
    )
}

export default ManageMigration