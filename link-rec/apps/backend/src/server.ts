import http from 'http';

console.log('hello friend');

// Create a simple HTTP server that keeps the process alive
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Server is running');
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
