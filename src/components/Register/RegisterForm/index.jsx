import { Link } from "react-router-dom"
import "./styles.css"

export default function RegisterForm(){
    return (
        <>
            <section>
                <h3>Vamos Começar!</h3>

                <h6>Já possui uma conta? <Link to={"/login"}>Entrar</Link></h6>

                {/* Barra de Progresso */}

                <form>
                    <label htmlFor="">Qual o seu nome completo?</label>
                    <input name="name" placeholder="Seu nome"></input>

                    <div className="button-help-container">
                        <button 
                            type="submit" 
                            className="proximo-btn"
                        >
                            Próximo
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
};
