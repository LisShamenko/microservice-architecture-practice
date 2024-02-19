import { BrowserRouter, Routes, Route } from "react-router-dom";
//
import App from '../modules/page/App/App';
import NewPageContainer from '../modules/page/PageComponent/NewPageContainer';
import OldPageContainer from '../modules/page/PageComponent/OldPageContainer';
import ErrorProvider from './ErrorProvider';
import { LoginPage } from '../modules/page/LoginPage/LoginPage';
import ErrorPageContainer from "../modules/page/ErrorPage/ErrorPageContainer";
import DashboardPageContainer from "../modules/page/DashboardPage/DashboardPageContainer";
import { LibraryPage } from "../library/page/LibraryPage/LibraryPage";



// 
export default function AppRouterProvider() {
    return (
        <BrowserRouter>
            <ErrorProvider>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<DashboardPageContainer />} />
                    <Route path="/error" element={<ErrorPageContainer />} />
                    <Route path="/library" element={<LibraryPage />} />
                    <Route path="/new" element={<NewPageContainer />} />
                    <Route path="/old" element={<OldPageContainer />} />
                </Routes>
            </ErrorProvider>
        </BrowserRouter>
    );
}
