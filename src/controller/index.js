import RuleController from './ruleController.js';
import initService from '../service/index.js';

export default async () => {

    const { ruleService } = await initService();

    const ruleController = new RuleController(ruleService);

    return {
        ruleController
    }

}