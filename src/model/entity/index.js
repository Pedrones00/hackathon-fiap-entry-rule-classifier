import RuleModel from "./rule.js";
import db from "../../config/db.js";

export default async () => {
    const Rule = RuleModel();

    await db.connection.sync({alter: true});

    return {
        Rule
    }
}