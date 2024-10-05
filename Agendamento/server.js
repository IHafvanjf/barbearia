const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Pusher = require('pusher');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pusher = new Pusher({
    appId: '1853712', // Substitua por seu App ID
    key: 'c5dc5b55973c301f7482',
    secret: 'bc2a1ea90bafa639584f', // Substitua por seu Secret
    cluster: 'sa1',
    useTLS: true
});

app.post('/pusher-event', (req, res) => {
    const { event, date, bookings } = req.body;

    pusher.trigger('calendar-channel', event, {
        date: date,
        bookings: bookings
    }).then(() => {
        console.log('Evento Pusher enviado:', bookings);
        res.send('Evento Pusher enviado com sucesso');
    }).catch(err => {
        console.error('Erro ao enviar evento Pusher:', err);
        res.status(500).send('Erro ao enviar evento Pusher');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
