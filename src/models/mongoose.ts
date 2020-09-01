import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/socmed-users";

mongoose
    .connect(url, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(
        () => {
            console.log("connected to database");
        },
        (err) => {
            console.log(err);
        }
    );
