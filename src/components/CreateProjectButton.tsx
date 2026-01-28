import { useNavigate } from 'react-router-dom';
import Kuboadd from "../assets/icons/Universal/Kubo-add.svg";

export default function CreateProjectButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/project/new')}
      className="inline-flex cursor-pointer items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
      title="Criar projeto"
    >
      <img src={Kuboadd} alt="Adicionar" className="w-10 h-10 sm:w-14 sm:h-14" />
    </button>
  );
}