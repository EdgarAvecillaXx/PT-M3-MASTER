const fs = require('fs');
const request = require('request');
module.exports = {
  date: (cb: Function): void => cb(Date()),
  pwd: (cb: Function): void => cb(process.cwd()),
  ls: (cb: Function): void =>
    fs.readdir('.', function (err: Error, files: string[]): void {
      if (err) return cb(err.message.substring(err.message.indexOf(' ') + 1));
      cb(files.join('\n'));
    }),
  echo: (cb: Function, args: string[]): void => cb(args.join(' ')),
  cat: (cb: Function, args: string[]): void =>
    fs.readFile(args[0], 'utf8', (err: Error, data: string) => {
      if (err) return cb(err.message.substring(err.message.indexOf(' ') + 1));
      cb(data);
    }),
  head: (cb: Function, args: [string, number]): void =>
    fs.readFile(args[0], 'utf8', (err: Error, data: string) => {
      if (err) return cb(err.message.substring(err.message.indexOf(' ') + 1));
      if (isNaN(args[1]) || !args[1]) args[1] = 5;
      const lines = data.split('\n').splice(0, args[1]).join('\n');
      cb(lines);
    }),
  tail: (cb: Function, args: [string, number]): void =>
    fs.readFile(args[0], 'utf8', (err: Error, data: string) => {
      if (err) return cb(err.message.substring(err.message.indexOf(' ')));
      const lines = data
        .split('\n')
        .splice(-(args[1] || 5))
        .join('\n');
      cb(lines);
    }),
  curl: (cb: Function, args: string[]): void => {
    if (!/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(args[0]))
      return cb('invalid url');
    request(args[0], function (err: Error, data: any) {
      err
        ? cb(err.message.substring(err.message.indexOf(' ') + 1))
        : cb(data.body);
    });
  },
  sort: (cb: Function, args: string[]): void =>
    fs.readFile(args[0], 'utf8', (err: Error, data: string) => {
      if (err) return cb(err.message.substring(err.message.indexOf(' ') + 1));
      const lines = data.split('\n').sort();
      if (args[1] === '-r') {
        lines.reverse();
      }
      cb(lines.join('\n'));
    }),
  wc: (cb: Function, args: string[]): void =>
    fs.readFile(args[0], 'utf8', (err: Error, data: string) => {
      if (err) return cb(err.message.substring(err.message.indexOf(' ') + 1));
      let lines: string[] = data.split('\r\n');
      if (args[1] === '-w') {
        lines = lines.join(' ').split(' ');
      }
      args[1] === '-m'
        ? cb(data.length.toString())
        : cb(lines.length.toString());
    }),
  uniq: (cb: Function, args: string[]): void =>
    fs.readFile(args[0], 'utf8', (err: Error, data: string) => {
      if (err) return cb(err.message.substring(err.message.indexOf(' ') + 1));
      const lines: string[] = data.split('\r\n');
      const uniqLines: string[] = lines.filter(
        (line, i) => line !== lines[i + 1]
      );
      cb(uniqLines.join('\r\n'));
    }),
};
