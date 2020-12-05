import mongoose from "mongoose";

const url = "mongodb+srv://test:test@cluster0.1n41s.mongodb.net/socmed-users?retryWrites=true&w=majority";

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
