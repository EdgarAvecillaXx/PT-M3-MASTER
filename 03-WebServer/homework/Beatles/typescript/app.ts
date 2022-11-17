var http = require('http');
var fs = require('fs');
const { html, json, text } = require('./headers');

type Beatle = {
  name: string;
  birthdate: string;
  profilePic: string;
};

var beatles: Beatle[] = [
  {
    name: 'John Lennon',
    birthdate: '09/10/1940',
    profilePic:
      'https://blogs.correiobraziliense.com.br/trilhasonora/wp-content/uploads/sites/39/2020/10/CBNFOT081020100047-550x549.jpg',
  },
  {
    name: 'Paul McCartney',
    birthdate: '18/06/1942',
    profilePic: 'http://gazettereview.com/wp-content/uploads/2016/06/paul-mccartney.jpg',
  },
  {
    name: 'George Harrison',
    birthdate: '25/02/1946',
    profilePic:
      'https://canaldosbeatles.files.wordpress.com/2012/02/george-george-harrison-8321345-438-600.jpg',
  },
  {
    name: 'Richard Starkey',
    birthdate: '07/08/1940',
    profilePic: 'http://cp91279.biography.com/BIO_Bio-Shorts_0_Ringo-Starr_SF_HD_768x432-16x9.jpg',
  },
];

http
  .createServer((request, response): void => {
    const sendResponse = (code: number, contentHeader: {}, res: string) => {
      response.writeHead(code, contentHeader);
      response.end(res);
    };

    const file = (name: string): string => {
      return fs.readFileSync(`${__dirname}/${name}.html`, 'utf-8');
    };

    const name = (index: number): Beatle =>
      beatles.find(beatle => request.url.substring(index) === encodeURI(beatle.name))!;

    if (request.url === '/') {
      sendResponse(200, html, file('index'));
    } else if (name(1)) {
      const beatle: Beatle = name(1);
      const template: string = file('beatle')
        .replace(/{name}/g, beatle.name)
        .replace(/{birth}/g, beatle.birthdate)
        .replace(/{profilePic}/g, beatle.profilePic);
      sendResponse(200, html, template);
    } else if (request.url === '/api' || request.url === '/api/') {
      sendResponse(200, json, JSON.stringify(beatles));
    } else if (request.url.substring(0, 5) === '/api/' && request.url.length > 5) {
      const beatle: Beatle = name(5);
      if (beatle) {
        sendResponse(200, json, JSON.stringify(beatle));
      } else {
        sendResponse(404, text, 'Error!!!! Este beatle no existe');
      }
    } else {
      sendResponse(404, html, 'Page not found');
    }
  })
  .listen(1337, '127.0.0.1');
