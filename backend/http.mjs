import http from 'http';
http.createServer((req,res)=>res.end('ok')).listen(8079, () => console.log('listening 8079'));
