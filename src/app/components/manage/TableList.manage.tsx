import { useState } from 'react'

import ManageTableinfo from "./Tableinfo.manage"
import DropTableDialog from './DropTable.dialog'
import ShowCreateDialog from './/ShowCreate.dialog'

function ManageTableList({ tablelist = [], updateList }: any) {

    const [checkContent, setCheckContent] = useState<any[]>([])
    const [dropTableOpen, setDropTableOpen] = useState(false)
    const [dropTableArgs, setDropTableArgs] = useState<any>({})
    const [showCreateOpen, setShowCreateOpen] = useState(false)
    const [showCreateArgs, setShowCreateArgs] = useState<any>({})

    const onShowDropTable = (_ev: any, args: any = {
        title: "", confirm: "", tablename: "", rowkey: -1
    }) => {
        setDropTableOpen(true)
        setDropTableArgs(args)
    }
    const onShowCreateTable = (_ev: any, args: any = {
        title: "", tablename: "", rowkey: -1
    }) => {
        setShowCreateOpen(true)
        setShowCreateArgs(args)
    }
    const onCloseMe = () => {
        setDropTableOpen(false)
        setShowCreateOpen(false)
        updateList()
    }

    const getTableinfo = async (tblkey: number, table: string) => {
        const response = await window.ipcRenderer.invoke('manage:get-tableinfo', table)
        setCheckContent(values => ({
            ...values, [tblkey]: (
                <ManageTableinfo key={table} tableData={response} tablename={table} infoKey={tblkey} onShowDropTable={onShowDropTable} onShowCreateTable={onShowCreateTable} />
            )
        }))
    }


    const handleCheck = (evt: any, key: any, table: any) => {
        if (evt.target.checked) {
            getTableinfo(key, table)
        }

    }
    return (
        <>
            {dropTableOpen && <DropTableDialog args={dropTableArgs} onCloseMe={onCloseMe} />}
            {showCreateOpen && <ShowCreateDialog args={showCreateArgs} onCloseMe={onCloseMe} />}

            <h2 className="m-4">Table List</h2>
            {tablelist.map((table: any, tblkey: any) => {
                return (
                    <div className="collapse collapse-arrow bg-base-100 border border-base-300" key={table}>
                        <input type="checkbox" onChange={(evt) => handleCheck(evt, tblkey, table)} />
                        <div className="collapse-title font-semibold">{table}</div>
                        <div className="collapse-content text-sm">{checkContent[tblkey]}</div>
                    </div >

                )
            })}
        </>
    )
}

export default ManageTableList