import { ipcMain } from 'electron'
import { getConnectionInfo } from './Auth.service'
import { getAppSequelize } from './Appdb.service'
import { QueryTypes } from 'sequelize'
import { inspect } from "node:util"
import Migration from '../../migrations/migration'

export default function ManageService(win: Electron.BrowserWindow) {
    ipcMain.handle('manage:get-tablelist', async () => {
        win.webContents.send('console-log-message', "Fetch table list...")
        try {
            const appSequelize = await getAppSequelize(win)
            const connection = await getConnectionInfo(win)

            //
            const migration = new Migration(appSequelize, connection.prefix)
            await migration.initMigrationTable()

            //
            const tables = await appSequelize.query('SELECT table_name FROM information_schema.tables WHERE table_schema=:schema', {
                replacements: { schema: connection.database },
                type: QueryTypes.SELECT,
            })
            let rows: any[] = []

            tables.map((row: any, key: number) => {
                rows[key] = row.TABLE_NAME
            })
            win.webContents.send('console-log-message', "Ok.")

            return rows
        } catch (error) {
            win.webContents.send('console-log-message', inspect(error))
            win.webContents.send('manage:log-message', inspect(error))
            throw error
        }

    })

    ipcMain.handle('manage:get-tableinfo', async (_ev, tablename) => {
        win.webContents.send('console-log-message', ["Fetch data ....", tablename])
        try {
            const appSequelize = await getAppSequelize(win)
            const connection = await getConnectionInfo(win)
            const tables = await appSequelize.query('SELECT * FROM information_schema.COLUMNS WHERE table_schema=:schema AND table_name=:name ORDER BY ORDINAL_POSITION', {
                replacements: {
                    schema: connection.database,
                    name: tablename
                },
                type: QueryTypes.SELECT,
            })

            const count = await appSequelize.query(`SELECT COUNT(*) as CNT FROM ${tablename}`, {

                type: QueryTypes.SELECT,
            })

            const results: any = {
                rowcount: count[0].CNT,
                columns: tables,
            }
            win.webContents.send('console-log-message', "Ok.")
            return results
        } catch (error) {
            win.webContents.send('console-log-message', inspect(error))
            win.webContents.send('manage:log-message', inspect(error))
            throw error
        }


    })

    ipcMain.handle('manage:get-tablecreate', async (_ev, tablename: string) => {
        const appSequelize = await getAppSequelize(win)
        const [res, _meta] = await appSequelize.query(`SHOW CREATE TABLE ${tablename}`)
        return inspect(res[0])
    })

    ipcMain.handle('manage:drop-table', async (_ev, tablename: string, removeMigration: boolean = false) => {
        const appSequelize = await getAppSequelize(win)
        let removeMsg: string = ""
        if (removeMigration) {
            const connection = await getConnectionInfo(win)
            const migration = new Migration(appSequelize, connection.prefix)
            try {

                removeMsg = " Migration entry has been removed."
                await migration.removeByTable(tablename)
            } catch (error) {
                removeMsg = "\n " + inspect(error)
            }

        }
        const [res, _meta] = await appSequelize.query(`DROP TABLE IF EXISTS ${tablename}`)
        win.webContents.send('manage:log-message', "Table: " + tablename + " has been dropped." + removeMsg)
        return inspect(res[0])
    })

    // migrations
    ipcMain.handle('migrate:get-list', async (_ev) => {
        const sequelize = await getAppSequelize(win)
        const connection = await getConnectionInfo(win)
        const migration = new Migration(sequelize, connection.prefix)
        const list = await migration.getMigrationList()
        return list
    })

    ipcMain.handle('migrate:info', async (_ev, name) => {
        const sequelize = await getAppSequelize(win)
        const connection = await getConnectionInfo(win)
        const migration = new Migration(sequelize, connection.prefix)
        return await migration.getMigrationInfo(name)
    })

    ipcMain.handle('migrate', async (_ev, name: string) => {
        let msg: any[] = []
        const msgName: string = name.length > 0 ? name : " all to the latest."
        msg.push("Start Migration: " + msgName + " ...")
        win.webContents.send('manage:log-message', "Start Migration: " + msgName + " ...")
        const sequelize = await getAppSequelize(win)
        const connection = await getConnectionInfo(win)
        const migration = new Migration(sequelize, connection.prefix)

        try {
            msg = await migration.migrate(name)
        } catch (error) {

            win.webContents.send('console-log-message', error)
            msg.push(inspect(error))
        }
        win.webContents.send('manage:log-message', msg)
    })
    ipcMain.handle('migrate:rollback', async (_ev, name: string) => {
        let msg: any[] = []
        const msgName: string = name.length > 0 ? name : "the latest batch"
        msg.push("Start Rolling Back: " + msgName + " ...")
        win.webContents.send('manage:log-message', "Start Rolling Back: " + msgName + " ...")
        const sequelize = await getAppSequelize(win)
        const connection = await getConnectionInfo(win)
        const migration = new Migration(sequelize, connection.prefix)

        try {
            msg = await migration.rollback(name)
        } catch (error) {

            win.webContents.send('console-log-message', error)
            msg.push(inspect(error))
        }
        win.webContents.send('manage:log-message', msg)
    })
}