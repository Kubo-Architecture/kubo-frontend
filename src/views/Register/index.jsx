import RegisterForm from "../../components/Register/RegisterForm"
import { SimpleHeader } from "../../components/Universal/SimpleHeader"
import "./styler.css"


export default function RegisterPage(){
    return(
        <>
        <div className="register-container">
            <SimpleHeader/>
            <RegisterForm/>
        </div>
        </>
    )
}