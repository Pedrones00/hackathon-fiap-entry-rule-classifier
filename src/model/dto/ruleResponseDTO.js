class RuleResponseDTO {
    constructor(object) {
        this.id = object.id;
        this.agency = object.agency;
        this.account = object.account;
        this.entry_name_pattern = object.entryNamePattern;
        this.category = object.category
    }
}

export default RuleResponseDTO;