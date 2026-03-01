import initController from '../controller/index.js';
import ErrorMiddleware from '../middleware/errorMiddleware.js';
import initRuleRoute from './ruleRoute.js';

export default async (app) => {
    const { ruleController } = await initController();

    const ruleRoute = await initRuleRoute(ruleController);

    app.use(ruleRoute);
    app.use(ErrorMiddleware.validate());

    return app;
}