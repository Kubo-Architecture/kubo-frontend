import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon.svg";
import DefaultProfilePhoto from "../../../assets/icons/Universal/defaultUserPhoto.svg";
import axios from 'axios';

export default function HeaderFull() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userId = window.localStorage.getItem('idUser');
    const apiUrl = `${import.meta.env.VITE_API_URL}/user/${userId}`

    axios.get(apiUrl)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar usuário:", err)
        if (err.code === "ERR_NETWORK" || err.response?.status === 404) {
          navigate("/error/404")
        }
      })
  }, []);

  // Função para verificar se o link está ativo
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 flex justify-center">
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo e título */}
          <div className="flex items-center">
            {/* Menu Hamburger para mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-10 h-8 focus:outline-none mr-2"
              aria-label="Menu"
            >
              <div className="w-6 h-5 relative transform transition-all duration-300">
                <span
                  className={`absolute left-0 h-0.5 w-full bg-gray-700 transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 top-2' : 'top-0'
                    }`}
                ></span>
                <span
                  className={`absolute left-0 h-0.5 w-full bg-gray-700 top-2 transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                ></span>
                <span
                  className={`absolute left-0 h-0.5 w-full bg-gray-700 transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 top-2' : 'top-4'
                    }`}
                ></span>
              </div>
            </button>

            {/* Navegação no header à esquerda - DESKTOP */}
            <nav className="w-auto hidden md:flex items-center space-x-8 ml-4">
              {/* Link Galeria */}
              <a
                href="/gallery"
                className={`transition-colors ${isActiveLink('/gallery') ? 'text-black font-bold' : 'text-gray-700 hover:text-black font-medium'}`}
              >
                Galeria
              </a>

            </nav>
          </div>

          {/* Logo Central */}
          <div className="w-6 h-7 flex justify-center items-center">
            <a href="/" className='w-full h-full flex justify-center items-center'>
              <img
                src={KuboIcon}
                alt="Kubo Icon"
                draggable={false}
                className="h-full w-full"
              />
            </a>
          </div>

          {/* Menu do usuário DESKTOP */}
          <div className="hidden md:flex relative justify-end w-auto">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-3 focus:outline-none cursor-pointer"
              aria-label="Menu do usuário"
            >
              <div className="relative">
                <img
                  className="h-10 w-10 rounded-full border border-gray-300 object-cover"
                  src={userData.photoUrl || DefaultProfilePhoto}
                  alt="Foto do perfil"
                />
              </div>
              <i
                className={`fas fa-chevron-down text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''
                  }`}
              ></i>
            </button>

            {/* Dropdown menu DESKTOP */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                ></div>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userData.name || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userData.email || ''}
                    </p>
                  </div>
                  <a
                    href={`/profile/${userData.nickname}`}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-user-circle mr-3 text-gray-400 w-5 text-center"></i>
                    <span>Meu Perfil</span>
                  </a>
                  <a
                    href="/Userconfig"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-cog mr-3 text-gray-400 w-5 text-center"></i>
                    <span>Configurações</span>
                  </a>
                  <a
                    href="/minhas-obras"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-bookmark mr-3 text-gray-400 w-5 text-center"></i>
                    <span>Minhas Obras</span>
                  </a>
                  <div className="border-t border-gray-200 my-1"></div>
                  <a
                    href="/ajuda"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-question-circle mr-3 text-gray-400 w-5 text-center"></i>
                    <span>Ajuda & Suporte</span>
                  </a>
                  <button
                    onClick={() => {
                      window.localStorage.clear();
                      navigate("/login")
                    }}
                    className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-sign-out-alt mr-3 w-5 text-center"></i>
                    <span>Sair</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Menu do usuário MOBILE */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
              aria-label="Menu do usuário"
            >
              <img
                className="h-10 w-10 rounded-full border border-gray-300 object-cover"
                src={userData.photoUrl || DefaultProfilePhoto}
                alt="Foto do perfil"
              />
            </button>

            {/* Dropdown menu MOBILE - AGORA COM TODOS OS LINKS */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                ></div>
                <div className="absolute right-4 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {/* Header com informações do usuário no mobile também */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userData.name || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userData.email || ''}
                    </p>
                  </div>

                  <a
                    href={`/profile/${userData.nickname}`}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-user-circle mr-3 text-gray-400 w-5 text-center"></i>
                    <span>Meu Perfil</span>
                  </a>

                  {/* CONFIGURAÇÕES NO MOBILE */}
                  <a
                    href="/Userconfig"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-cog mr-3 text-gray-400 w-5 text-center"></i>
                    <span>Configurações</span>
                  </a>

                  <a
                    href="/minhas-obras"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-bookmark mr-3 text-gray-400 w-5 text-center"></i>
                    <span>Minhas Obras</span>
                  </a>

                  <div className="border-t border-gray-200 my-1"></div>

                  {/* AJUDA & SUPORTE NO MOBILE */}
                  <a
                    href="/ajuda"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-question-circle mr-3 text-gray-400 w-5 text-center"></i>
                    <span>Ajuda & Suporte</span>
                  </a>

                  <button
                    onClick={() => {
                      window.localStorage.clear();
                      navigate("/login");
                    }}
                    className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-sign-out-alt mr-3 w-5 text-center"></i>
                    <span>Sair</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Menu mobile expandido */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64 py-4 border-gray-100' : 'max-h-0'
            }`}
        >
          <nav className="flex flex-col space-y-3">
            {/* Link Galeria Mobile */}
            <a
              href="/gallery"
              className={`py-2 px-2 transition-colors ${isActiveLink('/gallery') ? 'text-black font-bold border-l-4 pl-3' : 'text-gray-700 hover:text-black pl-4 font-medium'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Galeria
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}