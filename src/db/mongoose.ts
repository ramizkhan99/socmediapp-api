
import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017/socmed-users'

mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
}).then(
    () => { console.log("connected to database") },
    err => { console.log(err) }
);