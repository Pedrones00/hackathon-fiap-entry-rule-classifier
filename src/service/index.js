import RuleService from "./ruleService.js";
import initModel from "../model/entity/index.js"

export default async () => {

    const { Rule } = await initModel();

    const ruleService = new RuleService(Rule);

    return {
        ruleService
    }

}