const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use( '/api/auth', require("./routes/auth.routes") );

const PORT = config.get('port') || 5900;

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`app started on port ${PORT}...`));
    } catch (e) {
        console.log('Server Error', e.message);
        porcess.exit(1)
    }
}

start();

