import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';

const app = express();

import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/corticuadrado").then(_=>{
    console.log("------* Connected to Database *------");
})

// Exit application on error
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

app.use(morgan('dev'));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));

app.use(compression());


app.use(helmet());

app.use(cors());

app.use(function(req, res, next) {
    req.setTimeout(60 * 1000 * 20);
    next();
});
app.listen(5000, () => console.info(`server started on port 5000`));

//app.use('/api',router);

export default app;
