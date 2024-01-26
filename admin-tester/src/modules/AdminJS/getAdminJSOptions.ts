import { AdminJSOptions } from 'adminjs';
import { locales as AdminJSLocales } from 'adminjs';
// 
import { dbEntities } from '../Postgres/entity/entities';
import { componentLoader } from './components/loader';
import { DashboardResource } from './reasources/DashboardResource';
import { TestModelResource } from './reasources/TestModelResource';

// 
export const getAdminJSOptions = (): AdminJSOptions => ({
    rootPath: '/admin',
    branding: {
        companyName: 'company',
    },
    componentLoader,
    dashboard: DashboardResource,
    resources: [
        ...dbEntities,
        TestModelResource,
    ],
    locale: {
        language: 'ru',
        //      availableLanguages: Object.keys(AdminJSLocales),
        //      localeDetection: true,
        translations: {
            actions: {},
            buttons: {},
            labels: {},
            messages: {},
            properties: {},
            resources: {
                TestModel: {
                    actions: {
                        new: 'Create new TestModel',
                    }
                }
            }
        }
    },
});
