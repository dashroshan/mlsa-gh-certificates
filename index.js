import makePDF from './pdf.js';
import path from 'path';
import express from 'express'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/certificate/:name", async (req, res) => {
    const name = req.params.name;
    const data = await makePDF(name);
    res.status(200);
    res.type('pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${name} - MLSA Certificate.pdf`);
    res.send(data);
});

app.get("/admin", (req, res) => {
    res.render('home');
});

app.get("/", (req, res) => res.redirect('https://chat.whatsapp.com/FVfNoDzfnNi5VglrIT9ErG'));

app.listen(5004, () => console.log('Ready on port 5004...'));