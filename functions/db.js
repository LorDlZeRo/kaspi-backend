import mongoose from 'mongoose';

function connect (a) {
    mongoose.connect('mongodb+srv://awastzero:awastzero@cluster0.mooavpb.mongodb.net/?retryWrites=true&w=majority');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Ошибка соединения'))
    db.once('open', () => console.log('Connection is successful'))
      
    return mongoose
}

export default connect;