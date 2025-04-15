import "./styles.css"
import ImageNovidades from "../../../assets/icons/Universal/ImageNovidades.svg";
import ImgFaixa from "../../../assets/icons/Universal/ImgFaixa.svg";
import ImgOnda from "../../../assets/icons/Universal/ImgOnda.svg";
import ImgPredio from "../../../assets/icons/Universal/ImgPredio.svg";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function HomeBody(){
    return(
      <body>
        <div className="container-white">
          <section class="container-aviso">
            <h1 class="title-kubo">Kubo</h1>
            <p class="descricao-kubo">
              <b>
              O maior banco de <br />
              dados de arquitetura <br />
              do país
              </b>
            </p> 
          </section>        

              <div class="galeria">
                <img src={ImgFaixa} alt="Casa moderna" className="img imgCasa" />
                <img src={ImgOnda} alt="Vila com árvores" className="img imgárvores" />
                <img src={ImgPredio} alt="Planta arquitetônica" className="img imgdesenho" />
              </div>
          </div>

      <section class="container-black">
        <p class="text-container">
          + de <strong class="color-1000">1000</strong> projetos documentados
        </p>
      </section>

      <div class="novidades">
        <img src={ImageNovidades} alt="Novidades" class="img-novidades" />
        <div class="conteudo-novidades">
          <h1 class="novidadeh1">Novidades</h1>
          <div class="novidade-textos">
            <p>Agora, além de explorar</p>
            <p>milhares de estruturas </p>
            <p><b>incríveis</b>,você pode memorizar</p>
            <p>conceitos,técnicas e estilos de</p>
            <p> um jeito <b>interativo</b> e <b>eficaz</b>.</p>
          </div>
          <a href="#" class="btn-flashcard">Descubra os flashcards</a>
        </div>
      </div> 
      </body>
    )
}
