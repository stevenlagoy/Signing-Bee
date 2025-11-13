import express from 'express';
const app = express();
let server;
if (true) {
  server = app.listen(8126, () => console.log('Server running 8126'));
}
setTimeout(() => console.log('still alive after 1s'), 1000);
