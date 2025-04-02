import { useState, useEffect } from 'react'

import JsonFormatter from '../../components/JsonFormatter'
const AuthConnectingPage = () => {
    window.ipcRenderer.send('win:resize', { width: 800, height: 700 })
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const [inputs, setInputs] = useState({
        host: "",
        port: "",
        database: "",
        dbuser: "",
        dbpass: "",
        prefix: "wid_",
    })

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }


    const [consoleLog, setConsoleLog] = useState({})
    async function handleTestConnect(e: any) {
        setButtonDisabled(true)
        setConsoleLog("processing.....")
        await window.ipcRenderer.invoke('appdb:test-connection', inputs)
        e.preventDefault()

        setButtonDisabled(false)

    }


    async function handleSubmit(e: any) {

        setButtonDisabled(true)
        setConsoleLog("processing.....")
        await window.ipcRenderer.invoke('appdb:set-connection', inputs)
        e.preventDefault()
        setButtonDisabled(false)
    }

    useEffect(() => {
        window.ipcRenderer.on('console-log-message', (_event, response) => {
            setConsoleLog(response)
        })


    }, [consoleLog])


    return (
        <>
            <div className='items-center justify-center flex flex-col gap-6 '>
                <form>
                    <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                        <legend className="fieldset-legend">Setup your MySQL connection</legend>
                        <label className="input">
                            <span className="label w-40">Host</span>
                            <input type="text" name="host" placeholder="localhost" onChange={handleChange} value={inputs.host || ""} />
                        </label>
                        <label className="input">
                            <span className="label w-40">Port</span>
                            <input type="text" name="port" placeholder="3306" onChange={handleChange} value={inputs.port || ""} />
                        </label>
                        <label className="input">
                            <span className="label w-40">Database</span>
                            <input type="text" name="database" placeholder="db-name" onChange={handleChange} value={inputs.database || ""} />
                        </label>
                        <label className="input">
                            <span className="label w-40">Table Prefix</span>
                            <input type="text" name="prefix" placeholder="table-prefix" onChange={handleChange} value={inputs.prefix || ""} />
                        </label>
                        <label className="input">
                            <span className="label w-40">User</span>
                            <input type="text" name="dbuser" placeholder="db-user" onChange={handleChange} value={inputs.dbuser || ""} />
                        </label>
                        <label className="input">
                            <span className="label w-40">Password</span>
                            <input type="password" name="dbpass" placeholder="db-pass" onChange={handleChange} value={inputs.dbpass || ""} />
                        </label>

                        <button onClick={handleSubmit} disabled={buttonDisabled} className="btn btn-soft btn-primary">Connect</button>
                        <button onClick={handleTestConnect} disabled={buttonDisabled} className="btn btn-soft btn-secondary">Test Connection</button>
                    </fieldset>
                </form>
                <JsonFormatter jsonData={consoleLog} />
            </div>
        </>
    )
}
export default AuthConnectingPage