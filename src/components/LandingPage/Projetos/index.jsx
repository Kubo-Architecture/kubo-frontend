import Universo from "../../../assets/images/Universo.svg"

export default function Projetos(){
    return(
         <div className="px-8 py-10 md:px-25 md:mt-10 md:mb-5">
                    <div className="grid grid-row-2 md:grid-cols-2 px-5  shadow-[6px_6px_12px_rgba(0,0,0,0.45)] rounded-xl h-auto bg-[#F4F4F4] min-w-[350px]
                    md:mt-10  ">
        
                        <div className="order-1">
                            <div className="px-3 text-justify ">
                                <div className="text-3xl font-light mb-3 mt-5 w-auto
                                md:text-7xl md:w-100 md:px-3 md:mt-10 md:mb-10 ">
                                    <h1>Crie com os <span className="text-[#0B85FF] font-bold">Projetos</span></h1>
                                </div>
        
                                <div className="text-2xl
                                md:text-4xl md:font-light md:px-3 
                                ">
                                    <p>Deixe sua criatividade fluir e popule seu perfil com suas proprias obras de arte.</p>
                                </div>
                            </div>
        
                            <div className=" flex md:py-2 justify-center md:pt-15 md:mb-7 mb-5 text-2xl mt-10">
                                <a href="#" className="bg-[#0B85FF] px-25 py-2 text-white rounded-2xl">Crie já</a>
                            </div>
                        </div>

                          <div className="md:flex md:justify-center md:items-center pt-5 md:mb-4 rounded-2xl md:order-2">
                            <img src={Universo} alt="universo" className="rounded-xl w-full h-auto  object-cover md:h-125 md:w-100" />
                        </div>
                    </div>
                </div>
    );
}