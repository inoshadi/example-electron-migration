import fs from 'node:fs';
import crypto from 'node:crypto';

try {
    var data = await fs.readFileSync('.env', 'utf8');
    // console.log(data);
} catch (err) {
    fs.copyFileSync('.env.example', '.env');
    console.log('.env was created.');
}
data = await fs.readFileSync('.env', 'utf8');

const appkey = crypto.randomBytes(32).toString('hex');
const appkeyline = 'VITE_APP_KEY="' + appkey + '"';
if (false == data.includes("VITE_APP_KEY")) {
    data += "\n" + appkeyline;
    fs.writeFileSync('.env', data, 'utf-8');
    console.log(appkey);
    process.exit();
}

var lines = data.split("\n")
const newlines = lines.map((line) => {
    if (line.includes('VITE_APP_KEY="'))
        line = appkeyline;
    return line;
});

console.log(appkey);
// console.log(lines)
fs.writeFile('.env', newlines.join("\n"), 'utf-8', err2 => {
    if (err2) {
        console.log(err2);
    }
});
