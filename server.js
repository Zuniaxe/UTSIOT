const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const path = require('path');
let data = require(path.join(__dirname, 'data1.json'));

let lastIdx = data.nilai_suhu_max_humid_max.length > 0 ? data.nilai_suhu_max_humid_max[data.nilai_suhu_max_humid_max.length - 1].idx : 0; 

app.use(express.static('public'));
app.use(express.json());


app.get('/data', (req, res) => {
    res.json(data);
});

app.post('/add_suhu', (req, res) => {
    const newData = req.body;
    lastIdx += 1; 
    newData.idx = lastIdx; 
    data.nilai_suhu_max_humid_max.push(newData);
    fs.writeFile('./data/data1.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Data added successfully', err);
            res.status(500).json({ message: 'Data added successfully' });
        } else {
            res.json({ message: 'Data added successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
