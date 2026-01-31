import Kubo404 from '../assets/icons/Universal/Kubo404.png';
import Kubo500 from '../assets/icons/Universal/Kubo500.png';

export default function ErrorPage() {
  const is500 = window.location.pathname.includes('500');

  const errorCode = is500 ? '500' : '404';
  const errorMessage = is500
    ? 'Erro interno no servidor'
    : 'Página não encontrada';

  const errorImage = is500 ?  Kubo500 : Kubo404;

  return (
    <div className="min-h-screen bg-white dark:bg-[#151B23] flex items-center justify-center px-4">
      <div className="text-center">
        <img
          src={errorImage}
          alt="Erro"
          className="
            mx-auto
            w-[500px]
            md:w-[650px]
            lg:w-[750px]
            -mb-12
          "
        />

        <h1 className="text-6xl font-bold text-gray-900 dark:text-white leading-none mb-0">
          {errorCode}
        </h1>

        <p className="text-sm tracking-widest text-gray-600 dark:text-gray-400 uppercase mt-0">
          {errorMessage}
        </p>
      </div>
    </div>
  );
}