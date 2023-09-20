const express = require('express');
const app = express();

app.getAllClients = () => {
    const time = Math.random() * 8000;
}

app.get("/", (req, res) => {
    res.status(200).send({"result": "ok"})
})


app.listen(3000, () => console.log('Server is running on port 3000'));