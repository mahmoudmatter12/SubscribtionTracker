// any type of backend softwear takes this params (err, req, res, next)
// error -> is the error that was thrown
// req -> is the request object
// res -> is the response object
// next -> is the next middleware function in the stack

// EXP:
/**
 * @param {Error} err
 * @param {Request} req 
 * @param {Response} res
 * @param {Function} next
 * @returns {Response}
 * we trying to create a subscribtion -> middleware -> check for the renewalDate -> middleware checks for the errors -> next -> controller -> response
 */

const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };

        error.message = err.message;

        console.error(err);

        // Mongoose bad ObjectId
        if (err.name === 'CastError') {
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });
    } catch (error) {
        next(error);
    }
};
// We can also use the next function to pass the error to the next middleware function in the stack.
// If the next function is called with an error, Express will skip all remaining middleware functions and send the error to the default error handler.
// The default error handler will log the error and return a response with a status code of 500.
// If you want to create a custom error handler, you can define a middleware function that takes four arguments (err, req, res, next) and set it as the last middleware function in the stack.
// This function will be called when an error is passed to the next function.
// You can use this function to log the error, send a custom response, or perform any other error-handling tasks.

export default errorMiddleware;