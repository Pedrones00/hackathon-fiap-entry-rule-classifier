class ThrowError {
    static throwError(statusCode, message) {
        const error = new Error(message || 'Somenting went wrong');

        error.statusCode = statusCode || 500;

        throw error;
    }
}

export default ThrowError;