import HttpError from "./HttpError";

class NotFoundError extends HttpError {
    constructor(resource: string) {
        super(404, `${resource} not found`);
    }
}

export default NotFoundError;
