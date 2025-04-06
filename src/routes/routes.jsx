import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../views/LoginPage"
import ErrorPage from "../views/ErrorPage";
import Home from "../views/home";


export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/error/:errorCode" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    );
}