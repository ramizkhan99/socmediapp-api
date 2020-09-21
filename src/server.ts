import { app } from "./app";
import config from "./config/config";

const PORT = config.PORT || "5000";

app.listen(PORT, () => {
    console.log("server running on port: " + PORT);
});
