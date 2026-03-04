import express from 'express';
import ValidationMiddleware from '../middleware/validationMiddleware.js';
import ParamsIdDTO from '../model/dto/paramsIdDTO.js';
import RegisterRuleDTO from '../model/dto/registerRuleDTO.js';
import AnalyseEntryDTO from '../model/dto/analyseEntryDTO.js';
import UpdateCategoryNameDTO from '../model/dto/updateCategoryNameDTO.js';

export default async (ruleController) => {

    const routes = express.Router();

    routes.get(
        '/rules',
        async (request, response) => ruleController.getAll(request, response)
    );
    routes.get(
        '/rules/:id',
        ValidationMiddleware.validate(ParamsIdDTO),
        async (request, response) => ruleController.getById(request, response)
    );
    routes.post(
        '/rules',
        ValidationMiddleware.validate(RegisterRuleDTO),
        async (request, response) => ruleController.registerRule(request, response)
    )
    routes.post(
        '/cleanup',
        ValidationMiddleware.validate(RegisterRuleDTO),
        async (request, response) => ruleController.cleanup(request, response)
    );
    routes.post(
        '/analyze',
        ValidationMiddleware.validate(AnalyseEntryDTO),
        async (request, response) => ruleController.analyze(request, response)
    );
    routes.patch(
        '/rules',
        ValidationMiddleware.validate(UpdateCategoryNameDTO),
        async (request, response) => ruleController.updateCategoryName(request, response)
    );
    routes.delete(
        '/rules/:id',
        ValidationMiddleware.validate(ParamsIdDTO),
        async (request, response) => ruleController.delete(request, response)
    );

    return routes;

}