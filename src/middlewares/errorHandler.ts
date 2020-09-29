import { Request, Response, NextFunction } from "express";

// All error imports
import HttpError from "../errors/HttpError";

const errorHandler = (
    error: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    res.status(status).send({ success: false, status, message });
};

export default errorHandler;
