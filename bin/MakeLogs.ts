

const MakeLogs = (args: any, sep: string = "---------") => {
    let logs: any[] = []
    if (sep.length > 1) logs.push(sep)
    logs.push(args)
    if (sep.length > 1) logs.push(sep)
    return logs.length == 1 && sep.length < 1 ? logs[0] : logs
}
export const printErr = (args: any) => {
    let logs: any[] = []
    logs.push("Make migration Error:")
    logs.push(args)
    console.log(MakeLogs(logs))
    process.exit()
}

export default MakeLogs