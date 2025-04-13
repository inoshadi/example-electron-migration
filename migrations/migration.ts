import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { inspect } from "node:util"
import { Sequelize, QueryTypes } from 'sequelize'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

class Migration {

    //properties
    protected list: any[] = []
    protected mgrTablename: string = "migrations"
    protected sequelize: Sequelize
    protected tableprefix: string = "wid_"

    public migrationListPath = '../migrations/migration.json'

    //constructor
    constructor(sequelize: Sequelize, tableprefix: string = "wid_") {
        this.sequelize = sequelize
        this.tableprefix = tableprefix
        this.list = this.getList()

        // return class instance
        return this
    }

    //protected methods
    protected getList = () => {
        const fn = path.join(__dirname, this.migrationListPath)
        return JSON.parse(fs.readFileSync(fn, 'utf-8'))
    }

    // public methods

    public initMigrationTable = async () => {
        const tablename: string = this.tableprefix + this.mgrTablename
        return await this.sequelize.query("CREATE TABLE IF NOT EXISTS \
                `"+ tablename + "` ( \
                `id` int unsigned NOT NULL AUTO_INCREMENT,\
                `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,\
                `tablename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\
                `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\
                `batch` int NOT NULL,\
                PRIMARY KEY (`id`)\
                ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci \
                ")
    }

    public migrationTableExists = async () => {
        const tablename: string = this.tableprefix + this.mgrTablename

        const rows = await this.sequelize.query('SELECT table_name FROM information_schema.tables WHERE table_schema=:schema AND table_name = :tablename', {
            replacements: { schema: this.sequelize.getDatabaseName(), tablename: tablename },
            type: QueryTypes.SELECT,
        })
        return rows.length > 1

    }

    public getAvailableEntries = async () => {
        // const list = this.list
        const tablename: string = this.tableprefix + this.mgrTablename
        const mgrs = await this.sequelize.query(`SELECT batch,migration FROM ${tablename} ORDER BY batch ASC, migration ASC `, {
            type: QueryTypes.SELECT,
        })
        if (mgrs.length < 1)
            return this.list

        let excludes: any[] = []
        mgrs.map((row: any) => {
            excludes.push(row.migration)
        })

        let available: any[] = []
        this.list.map((ls) => {
            if (!excludes.includes(ls))
                available.push(ls)
        })
        return available
    }
    public getMigrationList = async (merged: boolean = true) => {
        if (!merged)
            return this.list
        let list: any[] = []

        const mgrExists = await this.migrationTableExists()
        if (!mgrExists)
            this.initMigrationTable()

        const tablename: string = this.tableprefix + this.mgrTablename
        const mgr = await this.sequelize.query(`SELECT migration FROM ${tablename} ORDER BY batch`, {
            type: QueryTypes.SELECT,
        })
        if (mgr.length < 1)
            return this.list
        mgr.map((row: any, _key) => {
            list.push(row.migration)
        })
        this.list.map((row) => {
            if (!list.includes(row))
                list.push(row)
        })
        return list
    }

    public exists = async (name: string) => {
        return this.list.includes(name)
    }

    public executed = async (name: string) => {

        const mgr = await this.getMigrationInfo(name)
        return Object.hasOwn(mgr, 'id')
    }

    public getMigrationInfo = async (name: string) => {
        const tablename: string = this.tableprefix + this.mgrTablename
        const mgr = await this.sequelize.query(`SELECT * FROM ${tablename} WHERE migration=:name`, {
            replacements: { name: name },
            type: QueryTypes.SELECT,
        })

        const empty: any = {}
        if (mgr.length < 1)
            return empty

        return mgr[0]
    }

    public getModule = async (name: string) => {
        const fn = path.join(__dirname, "../migrations/" + name + ".js")
        const mod = await import(fn)
        return new mod.default(this.sequelize, this.tableprefix)
    }

    public getMaxBatch = async () => {
        const tablename: string = this.tableprefix + this.mgrTablename
        const mgr = await this.sequelize.query(`SELECT MAX(batch) as max_batch FROM ${tablename} GROUP BY batch ORDER BY max_batch DESC LIMIT 1`, {
            type: QueryTypes.SELECT,
        })
        if (mgr.length < 1)
            return 0
        const row: any = mgr[0]
        return row.max_batch
    }

    public setMigration = async (name: string, table: string, action: string, batch: number = 0) => {
        const tablename: string = this.tableprefix + this.mgrTablename
        let newbatch: number = batch
        const maxbatch = await this.getMaxBatch()
        if (newbatch == 0) {
            newbatch = maxbatch
            newbatch += 1
        }

        return await this.sequelize.query(`
            INSERT INTO ${tablename}
            SET 
            migration = :name,
            tablename = :table,
            action = :action,
            batch = :batch
            `, {
            replacements: {
                name: name,
                table: table,
                action: action,
                batch: newbatch,
            },
            type: QueryTypes.INSERT,
        })
    }

    public removeByTable = async (tablename: string) => {
        const mgrtable: string = this.tableprefix + this.mgrTablename
        return await this.sequelize.query(`DELETE FROM ${mgrtable} WHERE tablename=:tablename`, {
            replacements: { tablename: tablename }
        })
    }

    public migrate = async (name: string) => {
        let msg: any[] = []
        const available = await this.getAvailableEntries()
        let entries: any[] = []
        if (name.length > 0) {
            msg.push("Checking Migration: " + name + "....")
            if (!available.includes(name)) {
                msg.push("..........Failed!.")
                msg.push("Migration entries not available or it has been executed.")
                return msg
            }
            entries.push(name)
            msg.push("........Done.")

        } else {
            entries = available
        }

        if (entries.length < 1) {
            msg.push("..........Failed!.")
            msg.push("Migration entries not available or it has been executed.")
            return msg
        }


        let mods: any[] = []

        let batch: number = await this.getMaxBatch()
        batch += 1

        for (const i in entries) {
            const mgr: string = entries[i]
            msg.push("Executing Migration: " + mgr + "...")

            try {
                mods[i] = await this.getModule(mgr)
                const sql = await mods[i].getUpSql()
                msg.push(sql)
                await mods[i].up()
                msg.push("........Done.")
                // console.log(mods)
            } catch (error) {
                console.log(error)
                msg.push("-----ERROR!-----")
                msg.push(inspect(error))
            }
            msg.push('Add entries for ' + mgr + "...")
            try {
                await this.setMigration(mgr, mods[i].table, mods[i].action, batch)
                msg.push("........Done.")
            } catch (error) {
                console.log(error)
                msg.push("-----ERROR!-----")
                msg.push(inspect(error))
            }
        }
        // msg.push(mods)
        return msg
    }

    public rollback = async (name: string) => {
        let msg: any[] = []
        let where: string = ""
        let replacements: any = {}
        if (name.length > 0) {
            where = " WHERE migration = :mgrname"
            replacements = {
                mgrname: name
            }
        } else {
            const maxbatch = await this.getMaxBatch()
            where = " WHERE batch = :maxbatch"
            replacements = {
                maxbatch: maxbatch
            }
        }
        const mgrtable: string = this.tableprefix + this.mgrTablename
        const list = await this.sequelize.query(`SELECT * FROM ${mgrtable} ${where} ORDER BY batch, migration `, {
            replacements: replacements,
            type: QueryTypes.SELECT,
        })
        if (list.length < 1) {
            msg.push("Failed to rolling back. No migration available.")
            return msg
        }

        let mods: any[] = []

        for (const i in list) {
            const row: any = list[i]
            msg.push("Rolling back: " + row.migration + "...")
            try {

                mods[i] = await this.getModule(row.migration)
                msg.push(await mods[i].getDownSql())
                await mods[i].down()
                msg.push('.......Done.')
                // console.log(mods)
            } catch (error) {
                console.log(error)
                msg.push("-----ERROR!-----")
                msg.push(inspect(error))

            }
            msg.push('Remove ' + row.migration + " from migration entries...")
            try {
                await this.sequelize.query(`DELETE FROM ${mgrtable} WHERE migration=:mgrname`, {
                    replacements: { mgrname: row.migration }
                })
                msg.push('.......Done.')
            } catch (error) {
                console.log(error)
                msg.push("-----ERROR!-----")
                msg.push(inspect(error))
            }
        }
        // msg.push(mods)
        return msg
    }
}
export default Migration