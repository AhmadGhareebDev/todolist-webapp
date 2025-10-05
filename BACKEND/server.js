require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3500;
const app = express();
const path = require('path');
const DBconnection = require('./config/DBconnection');
const mongoose = require('mongoose');
const { logger } = require('./middlewares/logEvents');
const errorLogger = require('./middlewares/errorLogger');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middlewares/verifyJWT');

DBconnection();
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/profileImages', express.static(path.join(__dirname, 'storage', 'profileImages')));


app.use('/register' , require('./routes/register'));
app.use('/login' , require('./routes/auth'));
app.use('/refresh', require('./routes/refreshToken'));
app.use('/verify-email', require('./routes/emailVerification'));
app.use('/re-verify-email' , require('./routes/resendVerificationToken'));

app.use('/reset' , require('./routes/api/resetPassword'))

app.use(verifyJWT);
app.use('/logout', require('./routes/logout'));
app.use('/user' , require('./routes/api/user'));





app.use(errorLogger);

mongoose.connection.once('open', () => {
    console.log('connected to the DATABASE');
    app.listen(PORT , () => {
        console.log(`listening to the server at PORT:${PORT}`);
    })
})