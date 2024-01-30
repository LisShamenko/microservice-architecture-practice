import React from 'react';
import { createRoot, Root } from 'react-dom/client';
//
import ReactQueryProvider from './providers/ReactQueryProvider';
import AppRouterProvider from './providers/AppRouterProvider';
import ReduxProvider from './providers/ReduxProvider';
import store from './redux/store';

// 
declare global {
    interface Window { store: any; }
}
window.store = store || {};

// 
const container: HTMLElement = document.getElementById('root')!;
const root: Root = createRoot(container);
root.render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <ReactQueryProvider>
                <button onClick={() => {
                    console.log('--- store = ' + JSON.stringify(store.getState()))
                }} >Store to console.</button>
                <AppRouterProvider />
            </ReactQueryProvider>
        </ReduxProvider>
    </React.StrictMode>
);
