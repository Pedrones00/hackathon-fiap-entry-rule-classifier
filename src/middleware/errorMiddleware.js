class ErrorMiddleware {
    static validate () {
        return (error, request, response, next) => {
            console.error('[Internal Error]: ', error);

            const statusCode = 500;
            const message = "Internal error";

            return response.status(statusCode).json({
                statusCode,
                message
            });
        }
    }
}

export default ErrorMiddleware;