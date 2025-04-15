import "./styles.css"
import { SimpleHeader } from "../../components/Universal/SimpleHeader"
import AuthSupportText from "../../components/Universal/AuthSupportText"
import SignUpForm from "../../components/SignupPage/SignUpForm"

export default function SignupPage(){
    return(
        <div className="container">
            <SimpleHeader />
            <AuthSupportText 
                greeting="Crie sua conta!" 
                redirectMessage="Já tem uma conta?" 
                destination="/login" 
                navigator="Faça login" 
            />
            <SignUpForm/>
        </div>
    )
}