class AnalyseEntryDTO {
    constructor(request) {
        this.validatedBodyDTOProperties = {
            idEntry: parseInt(request.body.id_entry, 10),
            agency: request.body.agency.trim(),
            account: request.body.account.trim(),
            entryName: request.body.entry_name.trim()
        };
        this.nameValidatedProperties = 'validatedBodyDTOProperties';
    }

    static validate(request) {
        const errors = [];
        const data = request.body;

        if (!data) return errors.push('No data');

        if (!data.id_entry || typeof data.id_entry !== 'number' || data.id_entry < 1) {
            errors.push('Invalid entry id');
        }

        if (!data.agency || typeof data.agency !== 'string' || data.agency.trim().length != 4 || !this.isNumber(data.agency)) {
            errors.push('Invalid agency. Must be a numeric string and have 4 characteres');
        }

        if (!data.account || typeof data.account !== 'string' || data.account.trim().length > 10 || data.account.trim().length < 1 || !this.isNumber(data.account)) {
            errors.push('Invalid acount. Must be a numeric string and have maximum 11 characteres');
        }

        if (!data.entry_name || typeof data.entry_name !== 'string' || data.entry_name.trim().length > 20 || data.entry_name.trim().length < 1){
            errors.push('Invalid entry name. Must be a string and have maximum 20 characters');
        }

        return errors;

    }

    static isNumber(value) {
        if (typeof value !== 'string') return false;
        if (value.trim() === '') return false;

        return !Number.isNaN(Number(value));
    }
}

export default AnalyseEntryDTO;