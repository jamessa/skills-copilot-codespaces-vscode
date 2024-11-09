// create web server

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// create server
http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log('pathname: ', pathname);

    if (pathname === '/') {
        fs.readFile('index.html', 'utf8', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (pathname === '/comment') {
        if (req.method === 'POST') {
            var body = '';

            req.on('data', function (data) {
                body += data;
            });

            req.on('end', function () {
                var post = qs.parse(body);
                console.log('post: ', post);

                fs.readFile('comment.json', 'utf8', function (err, data) {
                    var comments = JSON.parse(data);

                    comments.push(post);

                    fs.writeFile('comment.json', JSON.stringify(comments), function (err) {
                        res.writeHead(301, { 'Location': '/' });
                        res.end();
                    });
                });
            });
        }
    } else {
        fs.readFile('index.html', 'utf8', function (err, data) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
}).listen(3000, function () {
    console.log('Server is running at http://localhost:3000/');
});