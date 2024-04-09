import { BrowserRouter, Routes, Route } from "react-router-dom";
//
import App from '../modules/page/App/App';
import Error from '../modules/page/Error';
import { Wrapper } from "../modules/components/Wrapper";



// 
export default function AppRouterProvider() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/error" element={<h2>ERROR</h2>} />
                <Route element={<Error />}>
                    <Route path="/wrapper" element={<Wrapper />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
