class ValidationMiddleware {

    static validate(DTOclass) {
        return (request, response, next) => {
            const errors = DTOclass.validate(request);

            if (errors.length > 0) {
                return response.status(400).json({
                    message: 'Data validation error',
                    errors: errors
                });
            }

            const dtoObj = new DTOclass(request);
            
            request[dtoObj.nameValidatedProperties] = dtoObj[dtoObj.nameValidatedProperties];

            next();
        }
    }

}

export default ValidationMiddleware;