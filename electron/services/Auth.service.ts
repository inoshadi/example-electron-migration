import { app, ipcMain } from 'electron'
import { v4 as uuidv4, validate as isValidUUID } from 'uuid'
import { inspect } from "node:util"
import isDev from 'electron-is-dev'
import path from 'node:path'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import EncryptLib from '../libraries/Encrypt.lib'
const require = createRequire(import.meta.url)
var authSequelize: any

const { Sequelize, DataTypes, QueryTypes } = require('sequelize')

export function authGenerateAppUid(): string {
    return uuidv4();
}

export function getAuthAppUid() {
    return fs.readFileSync(getAuthPathAppInstanceId(), { encoding: 'utf-8' })
}

export function getAuthLcStorage() {
    return isDev ? path.join(app.getAppPath(), import.meta.env.VITE_DEV_STORAGE) : app.getPath("userData")
}

export function getAuthPathAppInstanceId() {
    return path.join(getAuthLcStorage(), import.meta.env.VITE_APP_INSTANCE)
}

export async function setAuthConnection(sequelize: any, win: Electron.BrowserWindow) {
    // await sequelize.drop();
    const Connection = sequelize.define(
        'Connection',
        {
            // ... (attributes)
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(100),
                defaultValue: 'default',
                allowNull: true
            },
            app_id: {
                type: DataTypes.STRING(36),
                defaultValue: '',
                allowNull: true
            },
            driver: {
                type: DataTypes.STRING(100),
                defaultValue: 'mysql',
                allowNull: true
            },
            database: {
                type: DataTypes.STRING(100),
                defaultValue: '',
                allowNull: true
            },
            user: {
                type: DataTypes.STRING(100),
                defaultValue: '',
                allowNull: true
            },
            pass: {
                type: DataTypes.STRING,
                defaultValue: '',
                allowNull: true
            },
            host: {
                type: DataTypes.STRING(100),
                defaultValue: '127.0.0.1',
                allowNull: true
            },
            port: {
                type: DataTypes.INTEGER,
                defaultValue: '3306',
                allowNull: true
            },
            prefix: {
                type: DataTypes.STRING(100),
                defaultValue: '',
                allowNull: true
            },
        },
        {
            tableName: 'connections',
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
            indexes: [
                {
                    name: 'connections_name_index',
                    fields: ['name'],
                },
                {
                    // name: 'app_id',
                    fields: ['app_id'],
                },
            ],

        },
    );
    // await Connection.sync()
    try {
        const connRes = await sequelize.query("SELECT name FROM sqlite_master WHERE type=:type AND name=:name", {
            replacements: { type: 'table', name: 'connections' },
            type: QueryTypes.SELECT,
        })
        if (connRes.length < 1)
            await Connection.sync({ force: true })
    } catch (error) {
        win.webContents.send('console-log-message', error)
    }

    const Online = sequelize.define(
        'Online',
        {
            // ... (attributes)
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            app_id: {
                type: DataTypes.STRING(36),
                defaultValue: '',
                allowNull: true
            },
            refresh_token: {
                type: DataTypes.STRING(100),
                defaultValue: '',
                allowNull: true
            },
            last_seen: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            expired_at: {
                type: 'TIMESTAMP',
                allowNull: true,
                defaultValue: Sequelize.literal('NULL'),
            }
        },
        {
            tableName: 'onlines',
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
            indexes: [
                {
                    // name: 'refresh_token',
                    fields: ['refresh_token'],
                },
                {
                    // name: 'app_id',
                    fields: ['app_id'],
                },
                {
                    // name: 'last_seen',
                    fields: ['last_seen'],
                },
            ],

        },
    );
    // await Online.sync()
    try {
        const onRes = await sequelize.query("SELECT name FROM sqlite_master WHERE type=:type AND name=:name", {
            replacements: { type: 'table', name: 'onlines' },
            type: QueryTypes.SELECT,
        })
        if (onRes.length < 1)
            await Online.sync({ force: true })
    } catch (error) {
        win.webContents.send('console-log-message', error)
    }

    return sequelize
}

export async function getAuthSequalize(win: Electron.BrowserWindow) {

    if (authSequelize !== undefined) {
        return authSequelize
    }
    const sqlitefn = path.join(getAuthLcStorage(), import.meta.env.VITE_SQLITE)
    let sequelize = new Sequelize({
        dialect: "sqlite",
        storage: sqlitefn,
        logging: false,
    })
    try {
        await sequelize.authenticate();
        // win.webContents.send('console-log-message', "SQLite3 Connection has been established successfully.")
        const [results, _metadata] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name='connections'")
        if (results.length < 1)
            sequelize = await setAuthConnection(sequelize, win)
        // return sequelize
        // try to query DB

    } catch (error) {
        win.webContents.send('console-log-message', { msg: "SQLite3 Error.", err: error })
        console.error('Unable to connect to the database:', error)
        return false
    }
    authSequelize = sequelize
    return authSequelize

}

export async function authIsConnected(win: Electron.BrowserWindow) {
    const instanceId = getAuthAppUid()
    if (!isValidUUID(instanceId))
        return win.webContents.send('auth:is-connected', false)

    const authSequelize = await getAuthSequalize(win)
    const results = await authSequelize.query("SELECT name FROM sqlite_master WHERE type=:type AND name=:name", {
        replacements: { type: 'table', name: 'connections' },
        type: QueryTypes.SELECT
    })

    if (results.length < 1)
        return win.webContents.send('auth:is-connected', false)
    const cons = await authSequelize.query("SELECT * FROM connections WHERE app_id=:app_id", {
        replacements: { app_id: instanceId },
        type: QueryTypes.SELECT
    })

    if (cons.length < 1)
        return win.webContents.send('auth:is-connected', false)
    const inputs = cons[0]
    if (!inputs.pass || inputs.pass == '' || inputs.pass == 'signed:out')
        return win.webContents.send('auth:is-connected', false)
    try {
        try {
            const encryptLib = new EncryptLib()
            var dbpass = encryptLib.decrypt(inputs.pass, import.meta.env.VITE_APP_KEY)
        } catch (error) {
            throw new Error('You have been signed out.')
        }

        // console.log(dbpass)
        const appSequelize = new Sequelize({
            dialect: inputs.driver,
            database: inputs.database,
            username: inputs.user,
            password: dbpass,
            host: inputs.host,
            port: parseInt(inputs.port),
        })
        await appSequelize.authenticate()
        win.webContents.send('auth:is-connected', true)

    } catch (error: any) {
        console.log(error)
        win.webContents.send('console-log-message', inspect(error.message))
        return win.webContents.send('auth:is-connected', false)
    }

}

export async function getConnectionInfo(win: Electron.BrowserWindow) {

    let response = {
        user: 'user',
        host: 'localhost',
        port: '3306',
        database: '',
        prefix: '',
    }
    const authSequelize = await getAuthSequalize(win)
    const instanceId = getAuthAppUid()
    const results = await authSequelize.query('SELECT * FROM connections WHERE app_id=:app_id', {

        replacements: { app_id: instanceId },
        type: QueryTypes.SELECT,
    })
    if (results.length < 1) return response

    const row = results[0]
    response.database = row.database
    response.user = row.user
    response.port = row.port
    response.host = row.host
    response.prefix = row.prefix

    return response
}

function AuthService(win: Electron.BrowserWindow) {
    console.log("request from: " + win.webContents.userAgent)
    ipcMain.handle('auth:connection-info', async () => {

        return await getConnectionInfo(win)
    })
    ipcMain.handle('auth:instance-init', () => {

        const instanceIdPath = getAuthPathAppInstanceId()
        if (!fs.existsSync(instanceIdPath)) {
            console.log("Instance ID's file does not exists.")
            fs.writeFileSync(instanceIdPath, authGenerateAppUid())
        }
        let instanceId = fs.readFileSync(instanceIdPath, { encoding: 'utf-8' })
        if (!isValidUUID(instanceId)) {
            instanceId = authGenerateAppUid()
            fs.writeFileSync(instanceIdPath, instanceId)
        }
        win.webContents.send('console-log-message', "Instance Id has been initiated.")

        authIsConnected(win)
    })
    ipcMain.handle('auth:signout', async () => {

        win.webContents.send('auth:is-connected', false)
        const instanceId = getAuthAppUid()
        try {

            if (!isValidUUID(instanceId)) {
                throw new Error("Could not update connection upon sign out. Invalid Instance ID")
            }

            const authSequelize = await getAuthSequalize(win)

            const resconn = await authSequelize.query('SELECT * FROM connections WHERE app_id=:app_id', {

                replacements: { app_id: instanceId },
                type: QueryTypes.SELECT,
            })
            if (resconn.length < 1) throw new Error('Could not update connection upon sign out. Connection not found.')

            await authSequelize.query('UPDATE connections SET pass=:resetpass, updated_at=CURRENT_TIMESTAMP WHERE app_id=:app_id', {
                replacements: { app_id: instanceId, resetpass: 'signed:out' },
                type: QueryTypes.SELECT,
            })
        } catch (error) {
            console.log(error)
            win.webContents.send('console-log-message', inspect(error))
        }
    })
}

export default AuthService


