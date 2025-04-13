import fs from "node:fs"

// reference: https://stackoverflow.com/a/44084313
export const snakeToPascal = (snake: string) => {
    return snake.split("_")
        .map(substr => substr.charAt(0)
            .toUpperCase() +
            substr.slice(1))
        .join("")
};

export const readFileSync = (fn: string) => {
    return fs.readFileSync(fn, 'utf8')
}

export const writeFileSync = (fn: string, fContent: string) => {
    let fd = fs.openSync(fn, 'w')
    fs.closeSync(fd)
    return fs.writeFileSync(fn, fContent, 'utf-8')
}

// reference: https://github.com/nodejs/node/issues/48207#issue-1728913345
// 
export function makeFalseUse(_var: any) {
    return null
}

export default function BinHelper() {
    console.log("Bin Helper")
}