import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
//
import App from '../modules/page/App/App';
import NewPageContainer from '../modules/page/PageComponent/NewPageContainer';
import OldPageContainer from '../modules/page/PageComponent/OldPageContainer';



// 
export default function AppRouterProvider() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/new" element={<NewPageContainer />} />
                    <Route path="/old" element={<OldPageContainer />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
