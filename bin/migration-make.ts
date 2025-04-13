
// 
import MakeLogs, { printErr } from './MakeLogs.ts'
import { snakeToPascal, readFileSync, writeFileSync, makeFalseUse } from './BinHelper.ts'
import dateFormat from "dateformat"


// /**
//  * <![FN]> format in lowercase this is a filename / relative path to the script caller
//  * <![CLASS]> format in PascalCase
//  * <![TABLE]> format in snake_case
//  * <![ACTION]> format in lowercase
//  * 
//  * yarn migration:make create [table_name]
//  * 
//  */
const mgrDir: string = 'migrations/'
const mgrListFn: string = mgrDir + 'migration.json'
const fnVar: string = '<![FN]>'
const classVar: string = '<![CLASS]>'
const tableVar: string = '<![TABLE]>'
const actionVar: string = '<![ACTION]>'
const useSyntax: string = "yarn migrate:make [action] [table]"
const useExam: string = "yarn migrate:make create my_table_name"

console.log(MakeLogs(["Make migration example:", "Syntax: " + useSyntax, "Example: " + useExam]))

const actionName = process.argv[2]
if (undefined == actionName) printErr(["Missing argument [action]", useSyntax, "example:", useExam])

const tableName = process.argv[3]
if (undefined == tableName) printErr(["Missing argument [table]", useSyntax, "example:", useExam])

const camelClassName: string = (actionName + "_" + tableName).toLowerCase()
let className: string = camelClassName
className = snakeToPascal(className.toLowerCase())

// 
const createTemplateFn: string = mgrDir + "create-table.txt"
let jsContent: string = ""
try {
    jsContent = readFileSync(createTemplateFn)
    makeFalseUse(jsContent)
}
catch (error) {
    console.log(error)
    printErr(["Cannot read template file:", createTemplateFn])
}


//

const generateFn = (fn: string, useDate: string | Date = 'now') => {
    const d: Date | string = useDate == 'now' ? new Date() : useDate
    const dt: string = dateFormat(d, "yyyymmddHHMMss")
    return dt + "_" + fn
}

const jsFn: string = generateFn(camelClassName)
const jsfnPath: string = mgrDir + jsFn + ".js"

jsContent = jsContent.replaceAll(fnVar, jsfnPath).replaceAll(classVar, className).replaceAll(actionVar, actionName).replaceAll(tableVar, tableName)

let dryRun: boolean = false
if (process.argv.length > 4) {
    for (let i = 4; i < process.argv.length; i++) {
        if (process.argv[i] == '--dry') {
            dryRun = true
        }
    }
}


if (dryRun) {
    console.log(MakeLogs(["Dry run invoked:", "Migration entry:", jsfnPath]))
    console.log(jsContent)
    console.log(MakeLogs(["Console end."]))
    process.exit()
}
// -------

// read migration.json
let mgrList: any[] = []
try {
    mgrList = JSON.parse(readFileSync(mgrListFn))
    mgrList.push(jsFn)
    writeFileSync(mgrListFn, JSON.stringify(mgrList, null, 2))
    console.log(MakeLogs(["Added new migration entry:", jsFn]))

} catch (error) {
    console.log(error)
    printErr(["Failed to update migration list file:", mgrListFn, jsFn])
}

try {
    writeFileSync(jsfnPath, jsContent)

} catch (error) {
    console.log(error)
    printErr(["Failed to write file:", jsfnPath])
}

console.log(MakeLogs(["Added new migration script:", jsfnPath]))