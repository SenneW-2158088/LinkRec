import http from 'http';

console.log('hello friend');

const port = process.env.PORT || 3030;

// Create a simple HTTP server that keeps the process alive
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Server is running');
});

server.listen(port, () => {
    console.log('Server is listening on port 3000');
});
