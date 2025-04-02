import { useState, useEffect } from 'react'
import ManageMigration from "../components/manage/Migration.manage"
import ManageTableList from "../components/manage/TableList.manage"
import JsonFormatter from '../components/JsonFormatter'
const appName = import.meta.env.VITE_APP_NAME

function ManagePage() {

    const [tablelist, setTablelist] = useState<any[]>([])
    const [mgrlist, setMgrlist] = useState<any[]>([])
    const [consoleLog, setConsoleLog] = useState({})
    const [randkey, setRandkey] = useState<any>(0)

    const updateTblList = async () => {
        const response = await window.ipcRenderer.invoke('manage:get-tablelist')
        setTablelist(response)
    }
    const updateMgrList = async () => {
        const res = await window.ipcRenderer.invoke('migrate:get-list')
        setMgrlist(res)
    }
    const updateList = async () => {
        const dt = new Date()
        setRandkey(dt.getTime())
        updateTblList()
        updateMgrList()
    }

    useEffect(() => {
        window.ipcRenderer.on('manage:log-message', (_event, response) => {
            setConsoleLog(response)
        })
        updateList()

    }, [])
    window.ipcRenderer.send('win:resize', { width: 1280, height: 800 })
    return (
        <>
            <title>{"Manage DB Table - " + appName}</title>
            <div className="grid grid-cols-1 gap-4  min-w-7xl p-8">
                <div className='w-full'><JsonFormatter jsonData={consoleLog} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4  min-w-7xl p-8">
                <div><ManageMigration migrationList={mgrlist} key={"mgr-" + randkey} updateList={updateList} /></div>
                <div><ManageTableList tablelist={tablelist} key={"tbl-" + randkey} updateList={updateList} /></div>
            </div>


        </>
    );
};

export default ManagePage