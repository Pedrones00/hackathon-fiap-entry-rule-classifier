class RuleController {

    constructor(ruleService) {
        this.ruleService = ruleService;
    }

    async getAll(request, response) {
        try {
            if (request.headers['x-internal-service']) console.log(`[Inbound] - from ${request.headers['x-internal-service']} - Received request for list all rules - ${new Date().toISOString()}`);

            const rules = await this.ruleService.getAll();
            return response.status(200).json(rules);
        } catch (error) {
            return response.status(error.statusCode || 500).json({message: error.message});
        }
    }

    async getById(request, response) {
        try {
            if (request.headers['x-internal-service']) console.log(`[Inbound] - from ${request.headers['x-internal-service']} - Receive request for return the rule ${request.validatedParamId} - ${new Date().toISOString()}`);

            const rule = await this.ruleService.getById(request.validatedParamId);
            return response.status(200).json(rule);
        } catch (error) {
            return response.status(error.statusCode || 500).json({message: error.message});
        }
    }

    async registerRule(request, response) {
        try {
            if (request.headers['x-internal-service']) console.log(`[Inbound] - from ${request.headers['x-internal-service']} - Receive request for register a new rule - ${new Date().toISOString()}`);

            const rule = await this.ruleService.registerRule(request.validatedBodyDTOProperties);
            return response.status(201).json(rule);
        } catch (error) {
            return response.status(error.statusCode || 500).json({message: error.message});
        }
    }

    async cleanup(request, response) {
        try {
            if (request.headers['x-internal-service']) console.log(`[Inbound] - from ${request.headers['x-internal-service']} - Recive a request for classify entries without saving in db - ${new Date().toISOString()}`);

            const idsChangedEntries = await this.ruleService.cleanup(request.validatedBodyDTOProperties);
            return response.status(200).json(idsChangedEntries);
        } catch (error) {
            return response.status(error.statusCode || 500).json({message: error.message});
        }
    }

    async analyze(request, response) {
        try {
            if (request.headers['x-internal-service']) console.log(`[Inbound] - from ${request.headers['x-internal-service']} - Received analysis request for Entry: ${request.validatedBodyDTOProperties.idEntry} - ${new Date().toISOString()}`);

            const classifiedEntry = await this.ruleService.analyze(request.validatedBodyDTOProperties);
            return response.status(200).json(classifiedEntry);
        } catch (error) {
            return response.status(error.statusCode || 500).json({message: error.message});
        }
    }

}

export default RuleController;