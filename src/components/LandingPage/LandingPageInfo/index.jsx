import Mesa from "../../../assets/images/mesa.svg"

export default function SobreNos() {
    return (
        <div className="md:grid grid-cols-2">
            <div className="ml-8">
                <div className="text-5xl font-montserrat mt-10 mb-10 ">
                    <h1>Sobre nós</h1>
                </div>
                <div className="text-4xl w-100 mb-10">
                    <p>A jornada que moldou <span className="text-[#0B85FF]">nossa</span> plataforma</p>
                </div>
                <div className="text-justify w-90 text-2xl">
                    <p>
                        Kubo é uma plataforma web desenvolvida com o objetivo de auxiliar estudantes de Arquitetura a se conectarem, inspirarem e compartilharem seus projetos acadêmicos e pessoais. Funcionando como uma rede social focada na área, o Kubo permite que a comunidade poste seus próprios projetos, visualize trabalhos de outros estudantes e monte um portfólio público voltado exclusivamente para a arquitetura.
                    </p>
                </div>
            </div>
            <div className="hidden md:block">
                <img src={Mesa} alt="imagem mesa" />
            </div>
        </div>
    );
}