import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../views/LoginPage/index.tsx";
import ErrorPage from "../views/ErrorPage/index.tsx";
import LandingPage from "../views/LandingPage/index.tsx";
import SignUpPage from "../views/SignUpPage/index.tsx";
import VerificationCodeInput from "../views/AuthPage/index.tsx";
import UserProfile from "../views/UserProfile/index.tsx";
import NicknameInput from "../views/NicknameInput/index.tsx";
import ProjectPage from "../views/ProjectPage/index.tsx";
import ForgotPassword from "../views/ForgotPassword/index.tsx";
import Gallery from "../views/Gallery/index.tsx";
import UserConfig from "../views/UserConfig/index.tsx";
import FavoritePage from "../views/FavoritePage.js";


export default function Rotas({ isAuthenticated, onLoginSuccess }: any) {
    return (
        <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/gallery" /> : <LandingPage />} />
            <Route path="/login" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
            <Route path="/error/:errorCode" element={<ErrorPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/auth/:idUser" element={<VerificationCodeInput />} />
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/profile/nickname" element={<NicknameInput />} />
            <Route path="/project/:projectID" element={<ProjectPage />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/Userconfig" element={<UserConfig />} />
            <Route path="/Favoritepage" element={<FavoritePage />} />
        </Routes>
    );
}