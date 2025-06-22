import Estatua from "../../../assets/images/Estatua.svg"

export default function Novidades() {
    return (
        <div className="px-8 py-10 md:px-25 min-w-[418px] md:mt-20">
            <div id="novidades" className="text-5xl mb-8 font-montserrat 
            md:font-light md:text-7xl 
">
                <h1>Novidades</h1>
            </div>
            <div className="grid grid-row-2 md:grid-cols-2 shadow-[6px_6px_12px_rgba(0,0,0,0.45)] rounded-xl h-auto bg-[#F4F4F4] 
            md:mt-10 
">

                <div className="md:flex md:justify-center md:items-center px-5 mt-4  rounded-2xl">
                    <img src={Estatua} alt="estátua" className="rounded-xl w-full h-auto object-cover md:h-125 md:w-100 " />
                </div>

                <div>
                    <div className="px-4 text-justify  ">
                        <div className="text-3xl font-light mb-3 mt-5 
                        md:text-7xl md:w-auto md:px-3 md:mt-10 md:mb-10 ">
                            <h1>Conheça a <span className="text-[#0B85FF] font-bold">Kubo Gallery</span></h1>
                        </div>

                        <div className="text-2xl
                        md:text-4xl md:font-light md:px-3 
                        ">
                            <p>A plataforma tras uma nova maneira de conhecer o mundo. A Kubo Gallery. Uma coletania de obras ricas em detalhes. </p>
                        </div>
                    </div>

                    <div className=" flex md:py-2 justify-center md:pt-15 md:mb-7 mb-5 text-xl mt-10 ">
                        <a href="#" className="bg-[#0B85FF] px-25 py-2 text-white rounded-2xl">Explore já</a>
                    </div>

                </div>
            </div>
        </div>
    );
}
