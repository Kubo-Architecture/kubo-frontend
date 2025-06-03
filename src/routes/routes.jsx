import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "../views/ErrorPage";
import LandingPage from "../views/LandingPage";
import VerificationCodeInput from "../views/AuthPage";
import UserProfile from "../views/UserProfile";
import AuthenticationPage from "../views/AuthenticationPage";


export default function Rotas() {
    return (
        
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthenticationPage />} />
                <Route path="/error/:errorCode" element={<ErrorPage />} />
                <Route path="/auth/:idUser" element={<VerificationCodeInput />} />
                <Route path="/username" element={<UserProfile />} />
            </Routes>
        </BrowserRouter>

    );
}
