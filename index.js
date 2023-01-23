import getCertificate from './pdf.js';
import path from 'path';
import express from 'express'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/certificate/:stdid", async (req, res) => {
    const stdid = req.params.stdid;
    let stdidTrue = (stdid.match(/[bB][0-9]{6}/g) || [null])[0]
    if (!stdidTrue) {
        res.render('error', { message: 'Invalid student ID' });
        return;
    }
    stdidTrue = stdidTrue.toLowerCase()
    const { valid, data } = await getCertificate(stdidTrue);
    if (!valid) {
        res.render('error', {
            message: 'You haven\'t completed the task yet'
        });
        return;
    }
    else {
        res.status(200);
        res.type('pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=MLSA GitHub Certificate.pdf');
        res.send(data);
    }
});

app.get("/certificate", (req, res) => {
    res.render('home');
});

app.get("/", (req, res) => res.redirect('https://chat.whatsapp.com/FVfNoDzfnNi5VglrIT9ErG'));

app.listen(5004, () => console.log('Ready on port 5004...'));