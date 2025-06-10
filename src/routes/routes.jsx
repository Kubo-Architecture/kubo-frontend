import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../views/LoginPage"
import ErrorPage from "../views/ErrorPage";
import LandingPage from "../views/LandingPage";
import SignUpPage from "../views/SignUpPage";
import VerificationCodeInput from "../views/AuthPage";
import UserProfile from "../views/UserProfile";
import ProjectPage from "../views/ProjectPage";


export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/error/:errorCode" element={<ErrorPage />} />
                <Route path="/register" element={<SignUpPage />} />
                <Route path="/auth/:idUser" element={<VerificationCodeInput />} />
                <Route path="/profile/:username" element={<UserProfile />} />
                <Route path="/project" element={<ProjectPage />} />
            </Routes>
        </BrowserRouter>
    );
}