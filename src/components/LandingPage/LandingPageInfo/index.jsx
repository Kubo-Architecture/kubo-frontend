import Mesa from "../../../assets/images/mesa.svg"

export default function SobreNos() {
    return (
        <div id="sobre nos" className="md:grid grid-cols-2 md:min-w-[1290px]">
            <div className="px-8 md:px-12 sm:w-full">
                <div className="text-5xl font-montserrat md:font-light mt-13 mb-10   
                 md:text-7xl
                 ">
                    <h1>Sobre nós</h1>
                </div>
                <div className="text-4xl w-100 mb-10 md:font-light
                sm:w-full
                md:text-5xl md:w-150">
                    <p>A jornada que moldou <span className="text-[#0B85FF]">nossa</span> plataforma</p>
                </div>
                <div className="text-justify w-full text-2xl font-normal
                ">
                    <p>
                        Kubo é uma plataforma web criada com o propósito de facilitar a conexão, o compartilhamento de ideias e a valorização de projetos no campo da Arquitetura. Pensada especialmente para estudantes e jovens profissionais da área, o Kubo funciona como uma rede social temática, onde os usuários podem publicar seus trabalhos acadêmicos e pessoais, trocar referências e acompanhar as produções de colegas de diferentes instituições e regiões.<br /><br />

                        A proposta central da plataforma é criar um ambiente colaborativo e inspirador, no qual estudantes possam divulgar seus projetos de maquetes, renders, croquis, plantas baixas e outras produções arquitetônicas. Além disso, o Kubo permite que os usuários organizem seus trabalhos em portfólios públicos, que podem ser visualizados por outros estudantes, professores e até profissionais da área, criando oportunidades de networking e visibilidade.                    </p>
                </div>
            </div>
            <div className="hidden 
            md:block md:flex md:justify-end md:items-start lg:mt-50 sm:mt-50
            ">
                <img src={Mesa} alt="imagem mesa" className="
                md:h-170 md:w-170
                "/>
            </div>
        </div>
    );
}