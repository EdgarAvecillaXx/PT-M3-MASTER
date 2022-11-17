"use strict";
const fs = require('fs');
const request = require('request');
module.exports = {
    date: (cb) => cb(Date()),
    pwd: (cb) => cb(process.cwd()),
    ls: (cb) => fs.readdir('.', function (err, files) {
        if (err)
            return cb(err.message.substring(err.message.indexOf(' ') + 1));
        cb(files.join('\n'));
    }),
    echo: (cb, args) => cb(args.join(' ')),
    cat: (cb, args) => fs.readFile(args[0], 'utf8', (err, data) => {
        if (err)
            return cb(err.message.substring(err.message.indexOf(' ') + 1));
        cb(data);
    }),
    head: (cb, args) => fs.readFile(args[0], 'utf8', (err, data) => {
        if (err)
            return cb(err.message.substring(err.message.indexOf(' ') + 1));
        if (isNaN(args[1]) || !args[1])
            args[1] = 5;
        const lines = data.split('\n').splice(0, args[1]).join('\n');
        cb(lines);
    }),
    tail: (cb, args) => fs.readFile(args[0], 'utf8', (err, data) => {
        if (err)
            return cb(err.message.substring(err.message.indexOf(' ')));
        const lines = data
            .split('\n')
            .splice(-(args[1] || 5))
            .join('\n');
        cb(lines);
    }),
    curl: (cb, args) => {
        if (!/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(args[0]))
            return cb('invalid url');
        request(args[0], function (err, data) {
            err
                ? cb(err.message.substring(err.message.indexOf(' ') + 1))
                : cb(data.body);
        });
    },
    sort: (cb, args) => fs.readFile(args[0], 'utf8', (err, data) => {
        if (err)
            return cb(err.message.substring(err.message.indexOf(' ') + 1));
        const lines = data.split('\n').sort();
        if (args[1] === '-r') {
            lines.reverse();
        }
        cb(lines.join('\n'));
    }),
    wc: (cb, args) => fs.readFile(args[0], 'utf8', (err, data) => {
        if (err)
            return cb(err.message.substring(err.message.indexOf(' ') + 1));
        let lines = data.split('\r\n');
        if (args[1] === '-w') {
            lines = lines.join(' ').split(' ');
        }
        args[1] === '-m'
            ? cb(data.length.toString())
            : cb(lines.length.toString());
    }),
    uniq: (cb, args) => fs.readFile(args[0], 'utf8', (err, data) => {
        if (err)
            return cb(err.message.substring(err.message.indexOf(' ') + 1));
        const lines = data.split('\r\n');
        const uniqLines = lines.filter((line, i) => line !== lines[i + 1]);
        cb(uniqLines.join('\r\n'));
    }),
};
