"use strict";
const commands = require('./commands');
function print(output) {
    process.stdout.write(output);
    process.stdout.write('\nprompt> ');
}
process.stdout.write('prompt> ');
process.stdin.on('data', data => {
    let args = data.toString().trim().split(' ');
    const cmd = args.shift();
    commands[cmd] ? commands[cmd](print, args) : print('command not found');
});
