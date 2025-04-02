import { useState, useEffect } from 'react'
import { NavLink } from 'react-router'
import SignoutIcon from './icons/Signout.svg'
import ReloadIcon from './icons/Reload.svg'

const Header = () => {
    const [connectionInfo, setConnectionInfo] = useState("user@localhost")
    const [dbname, setDbname] = useState('')
    const refreshHeader = async () => {
        const response = await window.ipcRenderer.invoke('auth:connection-info')
        if (response) {
            setConnectionInfo((response.user ?? "") + '@' + (response.host ?? "") + ':' + (response.port ?? ""))
            setDbname(response.database)
        }
    }
    useEffect(() => {
        refreshHeader()
    }, [])

    const onRefreshClick = async (_ev: any) => {
        location.reload()
    }
    async function handleSignout() {
        await window.ipcRenderer.invoke('auth:signout')
    }

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <ul className="menu menu-horizontal px-1">
                    <li><a onClick={onRefreshClick}><ReloadIcon /></a></li>
                    <li className='disabled'><div>{connectionInfo}</div></li>
                    <li><NavLink to="/manage">Manage {dbname}</NavLink></li>
                </ul>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><NavLink to="/">Main</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><button onClick={handleSignout} className=""><SignoutIcon /></button></li>
                </ul>
            </div>
        </div>
    )
}
export default Header