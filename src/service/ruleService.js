import ClassifiedEntryResponseDTO from "../model/dto/classifiedEntryResponseDTO.js";
import IdClassifiedEntryResponseDTO from "../model/dto/idClassifiedEntryResponseDTO.js";
import RuleResponseDTO from "../model/dto/ruleResponseDTO.js";
import ThrowError from "../utils/throwError.js";
import 'dotenv/config';

class RuleService {
    constructor(ruleModel) {
        this.ruleModel = ruleModel;
    }

    async #verififyCategoryExistsBudget(agency, account, category) {

        const params = new URLSearchParams({
            agency,
            account,
            category
        });

        const url = `${process.env.BUDGET_SERVICE_URL}${process.env.BUDGET_SERVICE_VERIFY_ENDPOINT}?${params}`;

        console.log(`[Outbound] Verify if category exists in budget service - ${new Date().toISOString()}`);

        
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Internal-Service': 'rule-classifier-service'
        },
        signal: AbortSignal.timeout(3000)
        });

        const response_body = await response.json();

        if (response_body.length === 0) ThrowError.throwError(404, "Budget category does not exists");
    }

    async #getEntrys(agency, account, entry_name, category) {

        const params = new URLSearchParams({
            agency,
            account,
            entry_name,
            category
        });

        const url = `${process.env.ACCOUNT_ENTRIES_SERVICE_URL}${process.env.ACCOUNT_ENTRIES_ENDPOINT}?${params}`;

        console.log(`[Outbound] Get entries for the given parameters in the account entry service - ${new Date().toISOString()}`);

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

    async #unclassifyEntry(id_entry) {
        const url = `${process.env.ACCOUNT_ENTRIES_SERVICE_URL}${process.env.ACCOUNT_ENTRIES_ENDPOINT}/${id_entry}/category`;

        console.log(`[Outbound] Unclassifying entry ${id_entry} in account entry service - ${new Date().toISOString()}`);

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Internal-Service': 'rule-classifier-service'
            },
            signal: AbortSignal.timeout(3000)
        });

        if(response.status !== 204) ThrowError.throwError(400, `Failed to remove category from entry id ${id_entry}`);
    }

    async #reclassifyEntrys(agency, account, oldCategory, newCategory) {

        const params = new URLSearchParams({
            agency: agency,
            account: account
        });

        const url = `${process.env.ACCOUNT_ENTRIES_SERVICE_URL}${process.env.ACCOUNT_ENTRIES_ENDPOINT}?${params}`;

        console.log(`[Outbound] Get entries for the given parameters in the account entry service - ${new Date().toISOString()}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Internal-Service': 'rule-classifier-service'
            },
            signal: AbortSignal.timeout(3000)
        });

        if (!response.ok) ThrowError.throwError(response.status, await response.json());

        const entries = await response.json();

        entries.forEach(async entry => {
            if (entry.category === oldCategory ) await this.#classifyEntry(entry.id, newCategory);
        });
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

        await this.#verififyCategoryExistsBudget(agency, account, category);

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

        await this.#verififyCategoryExistsBudget(agency, account, category);

        const entries = await this.#getEntrys(agency, account, entryNamePattern, false);

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

    async delete(id) {
        const rule = await this.ruleModel.findByPk(id);

        if (!rule) ThrowError.throwError(404, 'Rule does not exist');

        const entries = await this.#getEntrys(rule.agency, rule.account, rule.entryNamePattern, true);

        for (const entry of entries) {
            await this.#unclassifyEntry(entry.id);
        }

        await rule.destroy();

        return;
    }

    async updateCategoryName(data) {
        const { agency, account, newCategory, oldCategory } = data;

        const rules = await this.ruleModel.findAll({
            where: {
                agency: agency,
                account: account,
                category: oldCategory
            }
        });

        if (!rules || rules.length === 0) ThrowError.throwError(200, 'Nothing to update');

        for (const rule of rules) {
            await rule.update({ category: newCategory });
        }

        await this.#reclassifyEntrys(agency, account, oldCategory, newCategory)

    }

}

export default RuleService;