class ParamsIdDTO {

    constructor(request) {
        this.validatedParamId = request.params.id;
        this.nameValidatedProperties = 'validatedParamId';
    }

    static validate(request) {
        const errors = [];
        const data = request.params.id;

        if (!data || isNaN(data)) {
            errors.push('The entry ID must be a number');
        }

        return errors;
    }

}

export default ParamsIdDTO;