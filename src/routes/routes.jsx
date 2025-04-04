import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../views/LoginPage"
import ErrorPage from "../views/ErrorPage";
import Register from "../views/Register";
// import Home from "../views/home";


export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Ola mundo</h1>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/error/:errorCode" element={<ErrorPage />} />
                <Route path="/register" element={<Register />} />
                {/* <Route path="/home" element={<Home/>} /> */}
            </Routes>
        </BrowserRouter>
    );
}