class RegisterRuleDTO {

    constructor(request) {
        this.validatedBodyDTOProperties = {
            agency: request.body.agency.trim(),
            account: request.body.account.trim(),
            entryNamePattern: request.body.entry_name_pattern.trim(),
            category: request.body.category.trim()
        };
        this.nameValidatedProperties = 'validatedBodyDTOProperties';
    }

    static isNumber(value) {
        if (typeof value !== 'string') return false;
        if (value.trim() === '') return false;

        return !Number.isNaN(Number(value));
    }

    static validate(request) {
        const errors = [];
        const data = request.body;

        if (!data) return errors.push('No data');

        if (!data.agency || typeof data.agency !== 'string' || data.agency.trim().length != 4 || !this.isNumber(data.agency)) {
            errors.push('Invalid agency. Must be a numeric string and have 4 characteres');
        }

        if (!data.account || typeof data.account !== 'string' || data.account.trim().length > 10 || data.account.trim().length < 1 || !this.isNumber(data.account)) {
            errors.push('Invalid acount. Must be a numeric string and have maximum 11 characteres');
        }

        if (!data.entry_name_pattern || typeof data.entry_name_pattern !== 'string' || data.entry_name_pattern.trim().length > 20 || data.entry_name_pattern.trim().length < 1){
            errors.push('Invalid entry name. Must be a string and have maximum 20 characters');
        }

        if (!data.category || typeof data.category !== 'string' || data.category.trim().length > 50 || data.category.trim().length < 1) {
            errors.push('Invalid category. Must be a string and have maximum 50 characters');
        }

        return errors;

    }

}

export default RegisterRuleDTO;