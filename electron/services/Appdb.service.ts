import { app, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { inspect } from "node:util"
import { getAuthSequalize, getAuthAppUid } from './Auth.service'
import { v4 as uuidv4 } from 'uuid'
import EncryptLib from '../libraries/Encrypt.lib'

const require = createRequire(import.meta.url)
const { Sequelize, QueryTypes } = require('sequelize')

export async function getAppSequelize(win: Electron.BrowserWindow) {

    var authSequelize = await getAuthSequalize(win)
    const instanceId = getAuthAppUid()
    const results = await authSequelize.query('SELECT * FROM connections WHERE app_id=:app_id', {

        replacements: { app_id: instanceId },
        type: QueryTypes.SELECT,
    })
    if (results.length < 1) throw new Error('Connection not found.')

    const row = results[0]
    const encryptLib = new EncryptLib()
    const dbpass = encryptLib.decrypt(row.pass, import.meta.env.VITE_APP_KEY)
    const appSequelize = new Sequelize({
        dialect: row.driver,
        host: row.host,
        username: row.user,
        password: dbpass,
        database: row.database,
        port: parseInt(row.port),
    })
    return appSequelize
}

export default function AppdbService(win: Electron.BrowserWindow) {
    function validateInputs(inputs: any) {
        let err: any;
        let newinputs: any = inputs

        if (!newinputs.host) {
            newinputs.host = '127.0.0.1'
        }
        if (!newinputs.port) {
            newinputs.port = '3306'
        }
        if (!newinputs.database) {

            err = 'Database name required'
            return [newinputs, err]
        }
        if (!newinputs.dbuser) {

            err = 'Database user required'
            return [newinputs, err]
        }
        if (!newinputs.dbpass) {
            err = 'Database password required'
            return [newinputs, err]
        }

        return [newinputs, err]
    }

    async function testingConnection(inputs: any) {
        let err: boolean = false;
        const sequelize = new Sequelize({
            dialect: 'mysql',
            database: inputs.database,
            username: inputs.dbuser,
            password: inputs.dbpass,
            host: inputs.host,
            port: parseInt(inputs.port),
        });
        try {

            await sequelize.authenticate();

            // win.webContents.send('auth:is-connected', true)
            win.webContents.send('alert-message', 'Connection Success.')
        } catch (error: any) {
            console.log(error)
            win.webContents.send('console-log-message', error.message)
            win.webContents.send('alert-message', 'Could not connect to database.')
            err = true
        }

        return [err]
    }
    ipcMain.handle('appdb:test-connection', async (_e: Electron.IpcMainInvokeEvent, inputs: any) => {

        const [newinputs, err] = validateInputs(inputs)
        if (err) {
            win.webContents.send('console-log-message', err)
            return win.webContents.send('alert-message', "Validation error.")
        }
        const [errconn] = await testingConnection(newinputs)
        if (!errconn)
            win.webContents.send('console-log-message', ["Testing Connection Success.", "At: " + new Date()])

    })

    ipcMain.handle('appdb:set-connection', async (_e: Electron.IpcMainInvokeEvent, inputs: any) => {

        const [newinputs, err] = validateInputs(inputs)
        if (err) {
            win.webContents.send('console-log-message', err)
            return win.webContents.send('alert-message', "Validation error.")
        }
        const [errconn] = await testingConnection(newinputs)
        if (errconn) return errconn

        win.webContents.send('console-log-message', ["Success make connection.", "At: " + new Date()])

        try {
            var authSequelize = await getAuthSequalize(win)
        } catch (error) {
            console.log(error)
            win.webContents.send('console-log-message', inspect(error))
        }

        const instanceId = getAuthAppUid()

        const resonline = await authSequelize.query('SELECT * FROM onlines WHERE app_id=:app_id', {
            replacements: { app_id: instanceId },
            type: QueryTypes.SELECT,
        })
        if (resonline.length < 1) console.log(resonline)

        const resconn = await authSequelize.query('SELECT * FROM connections WHERE app_id=:app_id', {

            replacements: { app_id: instanceId },
            type: QueryTypes.SELECT,
        })
        let connectionId: string = ""
        const encryptLib = new EncryptLib()
        const encpass = encryptLib.encrypt(newinputs.dbpass, import.meta.env.VITE_APP_KEY)
        if (resconn.length < 1) {

            //insert
            connectionId = uuidv4()
            const sqlRaw = `INSERT INTO connections(
                id,app_id, 
                database, 
                user, 
                pass, 
                host,
                port, 
                prefix, 
                created_at, 
                updated_at) 
            VALUES(
                :uuid,
                :app_id, 
                :database, 
                :user, 
                :pass, 
                :host, 
                :port, 
                :prefix, 
                CURRENT_TIMESTAMP, 
                CURRENT_TIMESTAMP)`
            await authSequelize.query(sqlRaw, {

                replacements: {
                    uuid: connectionId,
                    app_id: instanceId,
                    database: newinputs.database,
                    user: newinputs.dbuser,
                    pass: encpass,
                    host: newinputs.host,
                    port: parseInt(newinputs.port),
                    prefix: newinputs.prefix,
                },
                type: QueryTypes.INSERT,
            })

        } else {
            connectionId = resconn[0].id
            const sqlRaw = `UPDATE connections 
            SET
             database= :database, 
             user= :user, 
             pass= :pass, 
             host= :host,
             port= :port, 
             prefix= :prefix, 
             updated_at= CURRENT_TIMESTAMP
            WHERE id= :uuid`
            await authSequelize.query(sqlRaw, {
                replacements: {
                    uuid: connectionId,
                    database: newinputs.database,
                    user: newinputs.dbuser,
                    pass: encpass,
                    host: newinputs.host,
                    port: parseInt(newinputs.port),
                    prefix: newinputs.prefix,
                },
                type: QueryTypes.UPDATE,
            })
        }

        win.webContents.send('auth:is-connected', true)

    })
    console.log("Initiate app db service from: " + win.webContents.userAgent)
    console.log("app name : " + app.name)


}