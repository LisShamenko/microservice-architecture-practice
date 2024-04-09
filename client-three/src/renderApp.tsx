import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { spy } from 'mobx';
//
import ReactQueryProvider from './providers/ReactQueryProvider';
import AppRouterProvider from './providers/AppRouterProvider';
import { RootStoreProvider } from './providers/RootStoreProvider';
import store from './stores/root-store';



// 
spy((ev) => {
    if (ev.type === 'action') {
        console.log(ev, 'event');
    }
});

declare global {
    interface Window { store: any; }
}
window.store = store || {};



// 
const container: HTMLElement = document.getElementById('root')!;
const root: Root = createRoot(container);
root.render(
    <React.StrictMode>
        <RootStoreProvider value={store}>
            <ReactQueryProvider>
                <button onClick={() => {
                    console.log('--- store = ' + JSON.stringify(store.getState()))
                }} >Store to console.</button>
                <AppRouterProvider />
            </ReactQueryProvider>
        </RootStoreProvider>
    </React.StrictMode>
);
