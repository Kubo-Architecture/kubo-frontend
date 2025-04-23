import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../views/LoginPage"
import ErrorPage from "../views/ErrorPage";
import Home from "../views/Home";
import SignUpPage from "../views/SignUpPage";
import VerificationCodeInput from "../views/AuthPage";


export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/error/:errorCode" element={<ErrorPage />} />
                <Route path="/register" element={<SignUpPage />} />
                <Route path="/auth" element={<VerificationCodeInput />} />
            </Routes>
        </BrowserRouter>
    );
}