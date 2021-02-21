import { app } from '../app';

const port = process.env.PORT || 3001;

console.log(`\n🎉  Starting HTTP server at http://localhost:${port}`);

app.listen(port);