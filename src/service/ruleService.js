import ClassifiedEntryResponseDTO from "../model/dto/classifiedEntryResponseDTO.js";
import IdClassifiedEntryResponseDTO from "../model/dto/idClassifiedEntryResponseDTO.js";
import RuleResponseDTO from "../model/dto/ruleResponseDTO.js";
import ThrowError from "../utils/throwError.js";
import 'dotenv/config';

class RuleService {
    constructor(ruleModel) {
        this.ruleModel = ruleModel;
    }

    async #getNotClassifiedEntrys(agency, account, entry_name) {

        const params = new URLSearchParams({
            agency,
            account,
            entry_name,
            category: false
        });

        const url = `${process.env.ACCOUNT_ENTRIES_SERVICE_URL}${process.env.ACCOUNT_ENTRIES_ENDPOINT}?${params}`;

        console.log(`[Outbound] Get non-classified entries for the given parameters in the account entry service - ${new Date().toISOString()}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Internal-Service': 'rule-classifier-service'
            },
            signal: AbortSignal.timeout(3000)
        });

        if (!response.ok) ThrowError.throwError(response.status, await response.json());

        return await response.json();
    }

    async #classifyEntry(id_entry, category) {
        const url = `${process.env.ACCOUNT_ENTRIES_SERVICE_URL}${process.env.ACCOUNT_ENTRIES_ENDPOINT}/${id_entry}/category`;

        console.log(`[Outbound] Classifying entry ${id_entry} in account entry service - ${new Date().toISOString()}`);

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Internal-Service': 'rule-classifier-service'
            },
            body: JSON.stringify({
                category: category
            }),
            signal: AbortSignal.timeout(3000)
        });

        if (!response.ok) ThrowError.throwError(response.status, await response.json());

        return await response.json();
    }

    async getAll() {
        const rules = await this.ruleModel.findAll();
        return rules.map(rule => new RuleResponseDTO(rule));
    }

    async getById(id) {
        const rule = await this.ruleModel.findByPk(id);

        if (!rule) ThrowError.throwError(404, 'Rule does not exist');

        return new RuleResponseDTO(rule);
    }

    async registerRule(data) {
        const {agency, account, entryNamePattern, category} = data;

        const oldRule = await this.ruleModel.findOne({
            where: {
                agency: agency,
                account: account,
                entryNamePattern: entryNamePattern
            }
        });

        if (oldRule) {
            oldRule.update({category: category})
            return new RuleResponseDTO(await oldRule.reload());
        }

        const rule = await this.ruleModel.create(
            {
                agency: agency,
                account: account,
                entryNamePattern: entryNamePattern,
                category: category
            }
        );

        return new RuleResponseDTO(await rule.reload());

    }

    async cleanup(data) {
        const {agency, account, entryNamePattern, category} = data;

        const entries = await this.#getNotClassifiedEntrys(agency, account, entryNamePattern);

        if (!entries || entries.length === 0)  ThrowError.throwError(400, 'Nothing to classify');

        const classifiedEntriesPromises = entries.map(async (entry) => {
            const responseObj = await this.#classifyEntry(entry.id, category);
            return responseObj.id;
        });

        const classifiedEntries = await Promise.all(classifiedEntriesPromises);

        return classifiedEntries.map(entry => new IdClassifiedEntryResponseDTO(entry));

    }

    async analyze(data) {
        const {idEntry, agency, account, entryName } = data;

        const rule = await this.ruleModel.findOne({
            where: {
                agency: agency,
                account: account,
                entryNamePattern: entryName
            }
        });

        if (!rule) ThrowError.throwError(404, 'Rule not found for this entry');

        const classifiedEntry = await this.#classifyEntry(idEntry, rule.category);

        return new ClassifiedEntryResponseDTO(classifiedEntry);
    }

}

export default RuleService;