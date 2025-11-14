import http from 'http';
http.createServer((req,res)=>res.end('ok')).listen(8080, () => console.log('listening 8080'));
