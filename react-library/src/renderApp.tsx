import React from 'react';
import ReactDOM from 'react-dom/client';
// 
import { LibraryPage } from './Library/page/LibraryPage/LibraryPage';

// 
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <LibraryPage />
    </React.StrictMode>
);
