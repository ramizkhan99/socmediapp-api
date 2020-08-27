
const mongoose = require('mongoose')
const url = 'mongodb://localhost/socmed-users'
mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
}).then(
    () => { console.log("connected to database") },
    err => { console.log(err) }
  );