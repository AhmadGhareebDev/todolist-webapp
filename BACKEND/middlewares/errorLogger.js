const { logEvents } = require('./logEvents');


const errorLogger = async (error ,req , res, next) => {

    logEvents(`${error.name}\t${error.message}` , 'errorLog.txt');
    res.status(500).send(error.message);
    
}

module.exports =  errorLogger ;