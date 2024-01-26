import { components } from '../components/loader';

// 
const handler = async () => {
    // Asynchronous code where you, e. g. fetch data from your database
    return { message: 'Hello World' }
}

export const DashboardResource = {
    component: components.Dashboard,
    handler: handler,
};
