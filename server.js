const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ChannelModel = require('./Models/Channel');
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.static('Temp'));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'LiveTvDb',
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

app.get('/channels', async (req, res) => {
    const categoryName = req.query.category;

    try {
        const channels = await ChannelModel.find({ category: categoryName });

        const channelData = channels.map((channel) => {
            return {
                name: channel.name,
                logo: channel.logo,
                link: channel.link,
            };
        });

        res.json(channelData);
    } catch (err) {
        res.status(500).send('Error fetching channels: ' + err);
    }
});

app.post('/channels', async (req, res) => {
    try {
        const { name, category, logo, link } = req.body;
        const newChannel = new ChannelModel({ name, category, logo, link });

        await newChannel.save();
        res.json(newChannel);
    } catch (err) {
        res.status(500).send('Error adding a channel: ' + err);
    }
});

