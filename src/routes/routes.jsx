import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../views/LoginPage"


export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Ola mundo</h1>} />
                <Route path="/login" element={<LoginPage/>} />
            </Routes>
        </BrowserRouter>
    );
}