import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../views/LoginPage.tsx";
import ErrorPage from "../views/ErrorPage.tsx";
import LandingPage from "../views/LandingPage.tsx";
import SignUpPage from "../views/SignUpPage.tsx";
import VerificationCodeInput from "../views/AuthPage.tsx";
import UserProfile from "../views/UserProfile.tsx";
import NicknameInput from "../views/NicknameInput.tsx";
import ProjectPage from "../views/ProjectPage.tsx";
import ForgotPassword from "../views/ForgotPassword.tsx";
import Gallery from "../views/Gallery.tsx";
import UserConfig from "../views/UserConfig.tsx";
import FavoritePage from "../views/FavoritePage.js";
import MaintenanceScreen from "../views/MaintenanceScreen.tsx";
import Newproject from "../views/Newproject.tsx";
import EditProjectPage  from "../views/EditProjectPage.tsx";


export default function Rotas({ isAuthenticated, hasNick, onLoginSuccess }: any) {
    return (
        <Routes>
            <Route path="/" element={isAuthenticated ? hasNick ? <Navigate to="/gallery" /> : <Navigate to="/profile/nickname" /> : <LandingPage />} />
            <Route path="/login" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
            <Route path="/error/:errorCode" element={<ErrorPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/auth/:userId" element={<VerificationCodeInput />} />
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/profile/nickname" element={<NicknameInput />} />
            <Route path="/project/:projectID" element={<ProjectPage />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/config" element={<UserConfig />} />
            <Route path="/favorites" element={<FavoritePage />} />
            <Route path="/MaintenanceScreen" element={<MaintenanceScreen />} />
            <Route path="/newproject" element={<Newproject />} />
            <Route path="/edit-project/:projectId" element={<EditProjectPage/>} />
        </Routes>
    );
}