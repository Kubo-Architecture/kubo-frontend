import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../views/LoginPage"
import ErrorPage from "../views/ErrorPage";
import LandingPage from "../views/LandingPage";
import SignUpPage from "../views/SignUpPage";
import VerificationCodeInput from "../views/AuthPage";
import UserProfile from "../views/UserProfile";
import NicknameInput from "../views/NicknameInput";
import ProjectPage from "../views/ProjectPage";
import ForgotPassword from "../views/ForgotPassword"
import Gallery from "../views/Gallery";
import UserConfig from "../views/UserConfig";


export default function Rotas({ isAuthenticated, onLoginSuccess }) {
    return (
        <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/gallery" /> : <LandingPage />} />
            <Route path="/login" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
            <Route path="/error/:errorCode" element={<ErrorPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/auth/:idUser" element={<VerificationCodeInput />} />
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/profile/nickname" element={<NicknameInput />} />
            <Route path="/project/:ProjectID" element={<ProjectPage />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/Userconfig" element={<UserConfig />} />
        </Routes>
    );
}