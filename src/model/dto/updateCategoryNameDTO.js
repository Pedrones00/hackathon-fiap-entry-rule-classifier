class UpdateCategoryNameDTO {
    constructor(request) {
        this.validatedBodyDTOProperties = {
            agency: request.body.agency.trim(),
            account: request.body.account.trim(),
            newCategory: request.body.new_category_name.trim(),
            oldCategory: request.body.old_category_name.trim()
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

        if (!data.new_category_name || typeof data.new_category_name !== 'string' || data.new_category_name.trim().length > 50 || data.new_category_name.trim().length < 1) {
            errors.push('Invalid new category. Must be a string and have maximum 50 characters');
        }

        if (!data.old_category_name || typeof data.old_category_name !== 'string') {
            errors.push('Invalid old category. Must be a string');
        }

        return errors;

    }
}

export default UpdateCategoryNameDTO;