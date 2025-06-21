import Mesa from "../../../assets/images/mesa.svg"

export default function SobreNos() {
    return (
        <div id="sobre nos" className="md:grid grid-cols-2 md:min-w-[1230px]">
            <div className="px-8 md:px-12 sm:w-full">
                <div className="text-5xl font-montserrat md:font-light mt-13 mb-10 
                 md:text-7xl
                 ">
                    <h1>Sobre nós</h1>
                </div>
                <div className="text-4xl w-100 mb-10 md:font-light
                sm:w-full
                md:text-5xl ">
                    <p>A jornada que moldou <span className="text-[#0B85FF]">nossa</span> plataforma</p>
                </div>
                <div className="text-justify w-full text-2xl font-light
                sm:text-3xl sm:w-135
                ">
                    <p>
                        Kubo é uma plataforma web desenvolvida com o objetivo de auxiliar estudantes de Arquitetura a se conectarem, inspirarem e compartilharem seus projetos acadêmicos e pessoais. Funcionando como uma rede social focada na área, o Kubo permite que a comunidade poste seus próprios projetos, visualize trabalhos de outros estudantes e monte um portfólio público voltado exclusivamente para a arquitetura.
                    </p>
                </div>
            </div>
            <div className="hidden 
            md:block md:flex md:justify-end md:items-start lg:mt-35
            ">
                <img src={Mesa} alt="imagem mesa" className="
                md:h-150 md:w-170
                "/>
            </div>
        </div>
    );
}