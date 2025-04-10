import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../views/LoginPage"
import ErrorPage from "../views/ErrorPage";
import Home from "../views/home";
import RegisterPage from "../views/Register";


export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/error/:errorCode" element={<ErrorPage />} />
                <Route path="/register" element={<RegisterPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}