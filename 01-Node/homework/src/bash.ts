const commands = require('./commands');

function print(output: string): void {
  process.stdout.write(output);
  process.stdout.write('\nprompt> ');
}

process.stdout.write('prompt> ');
process.stdin.on('data', data => {
  let args: string[] | string = data.toString().trim().split(' ');
  const cmd: string = args.shift()!;
  commands[cmd] ? commands[cmd](print, args) : print('command not found');
});
