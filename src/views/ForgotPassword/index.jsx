import Explorar from "../../components/Universal/LoginBanner/index"
import LogoKubo from "../../components/Universal/KuboLogo/index"
import Carta from "../../assets/icons/Universal/Carta.svg"

export default function ForgotPassword() {
    return (
        <div className="md:grid md:grid-cols-2 h-[100vh] min-w-[364px] md:px-5">
            {/* Container da esquerda - ajustado para ter altura completa e flex column */}
            <div className="flex flex-col h-full px-10 space-y-10 ">
                <div className=" mt-5 mb-20 md:flex md:mb-0 md:mt-10 ">
                    <LogoKubo />
                </div>
                <div className="flex justify-center">
                    <div className='bg-[#D9D9D9] rounded-full flex justify-end w-40 h-40 pr-7 mb-6 
                md:w-90 md:hidden'>
                        <img src={Carta} alt="carta" className='h-27 mt-6' />
                    </div>
                </div>

                <div className="text-4xl w-full 
                md:text-5xl 
                ">
                    <h1>Esqueci a senha</h1>
                </div>

                <form className="flex-grow">
                    <div className="">
                        <p className="w-80 text-3xl font-light
                        ">Digite seu E-mail para recuperar sua conta:</p>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Exemplo@dominio.com"
                            required
                            className="email-input mt-10 text-2xl"
                        />
                    </div>
                </form>

                {/* Container do botão que sempre fica no final */}
                <div className="w-full flex justify-start
                 pb-10
                md:-ml
                ">
                    <button type="submit" className="bg-[#000000b7] hover:bg-black transition text-xl duration-600 text-white font-Montserrat font-light px-27 py-2.5 rounded-xl">Enviar</button>
                </div>
            </div>

            <div className="w-[450px] h-[95vh] overflow-hidden relative bg-contain bg-center bg-no-repeat rounded-[14px] hidden ml-15 mt-5 md:py-3
            md:block">
                <Explorar />
            </div>
        </div>
    );
}