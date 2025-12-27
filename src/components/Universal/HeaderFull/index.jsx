import React, { useState } from 'react';
import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon.svg";
import axios from 'axios';

export default function HeaderFull() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState({});

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

  const user = {
    name: "Kubo",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100",
    role: "Arquiteto"
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e título */}
          <div className="flex items-center">
            {/* Menu Hamburger para mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden mr-4 relative w-8 h-8 focus:outline-none"
              aria-label="Menu"
            >
              <div className="w-6 h-5 relative transform transition-all duration-300">
                <span
                  className={`absolute left-0 h-0.5 w-full bg-gray-700 transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 top-2' : 'top-0'
                  }`}
                ></span>
                <span
                  className={`absolute left-0 h-0.5 w-full bg-gray-700 top-2 transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></span>
                <span
                  className={`absolute left-0 h-0.5 w-full bg-gray-700 transform transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 top-2' : 'top-4'
                  }`}
                ></span>
              </div>
            </button>

           

            {/* Navegação no header à esquerda */}
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="/"
                className="text-gray-700 hover:text-black transition-colors font-medium"
              >
                Home
              </a>
              <a
                href="/gallery"
                className="text-gray-700 hover:text-black transition-colors font-medium"
              >
                Galeria
              </a>
              <a
                href="#colecoes"
                className="text-gray-700 hover:text-black transition-colors font-medium"
              >
                Favoritos
              </a>
            </nav>
          </div>
           <div className="flex items-center mr-8">
              <div className="w-7 h-8 flex justify-between mr-3">
                <a href="/">
                  <img src={KuboIcon} alt="Kubo Icon" draggable={false} className="h-full" />
                </a>
              </div>
            </div>

          {/* Menu do usuário */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-3 focus:outline-none cursor-pointer"
            >
              <div className="flex flex-col items-end mr-3">
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                <span className="text-xs text-gray-500">{user.role}</span>
              </div>
              <div className="relative">
                <img
                  className="h-10 w-10 rounded-full border border-gray-300"
                  src={user.avatar}
                  alt={user.name}
                />
              </div>
              <i
                className={`fas fa-chevron-down text-gray-400 transition-transform ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              ></i>
            </button>

            {/* Dropdown menu */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <a
                    href={`/profile/${userData.nickname}`}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <i className="fas fa-user-circle mr-3 text-gray-400"></i>
                    <span>Meu Perfil</span>
                  </a>
                  <a
                    href="/Userconfig"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <i className="fas fa-cog mr-3 text-gray-400"></i>
                    <span>Configurações</span>
                  </a>
                  <a
                    href="/minhas-obras"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <i className="fas fa-bookmark mr-3 text-gray-400"></i>
                    <span>Minhas Obras</span>
                  </a>
                  <div className="border-t border-gray-200 my-1"></div>
                  <a
                    href="/ajuda"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <i className="fas fa-question-circle mr-3 text-gray-400"></i>
                    <span>Ajuda & Suporte</span>
                  </a>
                  <a
                    href="/sair"
                    className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    <span>Sair</span>
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Menu do usuário mobile simplificado */}
          <div className="md:hidden flex items-center space-x-3">
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900 block">{user.name}</span>
              <span className="text-xs text-gray-500 block">{user.role}</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
            >
              <img
                className="h-10 w-10 rounded-full border border-gray-300"
                src={user.avatar}
                alt={user.name}
              />
            </button>

            {/* Dropdown menu mobile */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                ></div>
                <div className="absolute right-4 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <a
                    href="/profile/:username"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <i className="fas fa-user-circle mr-3 text-gray-400"></i>
                    <span>Meu Perfil</span>
                  </a>
                  <a
                    href="/minhas-obras"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <i className="fas fa-bookmark mr-3 text-gray-400"></i>
                    <span>Minhas Obras</span>
                  </a>
                  <a
                    href="/sair"
                    className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    <span>Sair</span>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Menu mobile expandido */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-64 py-4' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col space-y-4">
            <a
              href="/"
              className="text-gray-700 hover:text-black transition-colors font-medium py-2 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/gallery"
              className="text-gray-700 hover:text-black transition-colors font-medium py-2 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Galeria
            </a>
            <a
              href="#colecoes"
              className="text-gray-700 hover:text-black transition-colors font-medium py-2 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Favoritos
            </a>
            <a
              href="/Userconfig"
              className="text-gray-700 hover:text-black transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Configurações
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}