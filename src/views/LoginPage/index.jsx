import "./styles.css"
import { SimpleHeader } from "../../components/Universal/SimpleHeader"
import AuthSupportText from "../../components/Universal/AuthSupportText"
import LoginForm from "../../components/LoginPage/LoginForm"

export default function LoginPage(){
    return(
        <div className="container">
            <SimpleHeader />
            <AuthSupportText greeting="Bem vindo de volta!" redirectMessage="Ainda não tem uma conta?" destination="test" navigator="Cadastre-se" />
            <LoginForm/>
        </div>
    )
}