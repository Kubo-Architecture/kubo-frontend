import AuthSupportText from "../../components/Universal/AuthSupportText"
import { SimpleHeader } from "../../components/Universal/SimpleHeader"
import RegistrationForm from "../../components/Register/RegisterForm"
import "./register.css"


export default function Register(){
    return(
        <div className="register-container">
            <SimpleHeader />
            <AuthSupportText greeting="Vamos começar!" redirectMessage="Ja tem uma conta?" destination="login" navigator="Entrar" />
            <RegistrationForm/>
        </div>
    )
}