import { useState } from 'react';
import KuboIcon from "../../assets/icons/Universal/kubo-main-icon.svg";
import KuboIconWhite from "../../assets/icons/Universal/kubo-main-icon-white.svg";
import DefaultProfile from "../../assets/Profile/defaultProfile.svg"
import { useNavigate } from 'react-router-dom';

export default function HeaderFull({ userData }: any) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isActiveLink = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-[#181818] border-b dark:border-[#1b1f23] border-neutral-200 z-50 flex justify-center">
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-10 h-8 focus:outline-none mr-2"
              aria-label="Menu"
            >
              <div className="w-6 h-5 relative transform transition-all duration-300">
                <span
                  className={`absolute left-0 h-0.5 w-full bg-gray-700 dark:bg-white transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 top-2' : 'top-0'
                    }`}
                ></span>
                <span
                  className={`absolute left-0 h-0.5 w-full bg-gray-700 dark:bg-white top-2 transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                ></span>
                <span
                  className={`absolute left-0 h-0.5 w-full bg-gray-700 dark:bg-white transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 top-2' : 'top-4'
                    }`}
                ></span>
              </div>
            </button>

            <nav className="hidden md:flex items-center space-x-8 ml-4 w-20">
              <a
                onClick={() => navigate('/gallery')}
                className={`cursor-pointer transition-colors ${isActiveLink('/gallery') ? 'text-black font-medium dark:text-white' : 'text-gray-700 dark:text-gray-100 hover:text-black dark:hover:text-gray-300 font-normal'}`}
              >
                Galeria
              </a>

            </nav>
          </div>

          <div className="w-6 h-7 flex justify-center items-center">
            <a href="/" className='flex dark:hidden w-full h-full justify-center items-center'>
              <img
                src={KuboIcon}
                alt="Kubo Icon"
                draggable={false}
                className="h-full w-full"
              />
            </a>

            <a href="/" className='hidden dark:flex w-full h-full justify-center items-center'>
              <img
                src={KuboIconWhite}
                alt="Kubo Icon"
                draggable={false}
                className="h-full w-full"
              />
            </a>
          </div>

          <div className="hidden md:flex relative justify-end w-20">
            {userData ? (
              <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-3 focus:outline-none cursor-pointer"
              aria-label="Menu do usuário"
            >
              <div className="relative">
                <img
                  className="h-10 w-10 rounded-full border border-gray-300 object-cover"
                  src={userData?.photoUrl || DefaultProfile}
                  alt="Foto do perfil"
                />
              </div>
              <i
                className={`fas fa-chevron-down text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''
                  }`}
              ></i>
            </button>) : (
              <span className='cursor-pointer' onClick={() => navigate('/login')}>Entrar</span>
            )}

            {(isMenuOpen && userData) && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                ></div>
                <div className="absolute right-0 top-full mt-4 w-56 bg-white dark:bg-[#212121] rounded-2xl shadow-lg dark:border-none border border-gray-200 z-50">
                  <div className="px-4 py-3 border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate">
                      {userData?.name || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userData?.email || ''}
                    </p>
                  </div>
                  <a
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/profile/${userData?.nickname}`)
                    }}
                    className="flex items-center px-2 py-3 mx-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-[#494949] transition-colors cursor-pointer"
                  >
                    <i className="fas fa-user-circle mr-3 dark:text-white w-5 text-center"></i>
                    <span className='dark:text-white'>Meu Perfil</span>
                  </a>
                  <a
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/config');
                    }}
                    className="flex items-center px-2 py-3 mx-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-[#494949] transition-colors cursor-pointer"
                  >
                    <i className="fas fa-cog mr-3 dark:text-white w-5 text-center"></i>
                    <span className='dark:text-white'>Configurações</span>
                  </a>
                  <a
                    href="/Favoritepage"
                    className="flex items-center px-2 py-3 mx-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-[#494949] transition-colors"
                  >
                    <i className="fas fa-star mr-3 dark:text-white w-5 text-center"></i>
                    <span className='dark:text-white'>Favoritos</span>
                  </a>
                  <div className="border-t border-gray-200 dark:border-[#535353] my-1"></div>
                  <a
                    onClick={() => {
                      window.localStorage.clear();
                      navigate("/login")
                    }}
                    className="flex items-center px-2 py-3 m-2 rounded-xl text-sm text-red-600 hover:bg-[#FDEFEF] dark:text-[#EC7B7A] dark:hover:bg-[#4C3333] transition-colors cursor-pointer"
                  >
                    <i className="fas fa-sign-out-alt mr-3 w-5 text-center"></i>
                    <span>Sair</span>
                  </a>
                </div>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
          {userData ? (<button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
              aria-label="Menu do usuário"
            >
              <img
                className="h-10 w-10 rounded-full border border-gray-300 object-cover cursor-pointer"
                src={userData?.photoUrl || DefaultProfile}
                alt="Foto do perfil"
              />
            </button>) : (
              <span className='cursor-pointer' onClick={() => navigate('/login')}>Entrar</span>
            )}

            {(isMenuOpen && userData) && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                ></div>
                <div className="absolute right-0 top-full mt-1 mr-5 w-56 bg-white dark:bg-[#212121] rounded-2xl shadow-lg dark:border-none border border-gray-200 z-50">
                  <div className="px-4 py-3 border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate">
                      {userData?.name || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userData?.email || ''}
                    </p>
                  </div>
                  <a
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/profile/${userData?.nickname}`)
                    }}
                    className="flex items-center px-2 py-3 mx-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-[#494949] transition-colors cursor-pointer"
                  >
                    <i className="fas fa-user-circle mr-3 dark:text-white w-5 text-center"></i>
                    <span className='dark:text-white'>Meu Perfil</span>
                  </a>
                  <a
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/config');
                    }}
                    className="flex items-center px-2 py-3 mx-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-[#494949] transition-colors cursor-pointer"
                  >
                    <i className="fas fa-cog mr-3 dark:text-white w-5 text-center"></i>
                    <span className='dark:text-white'>Configurações</span>
                  </a>
                  <a
                    href="/Favoritepage"
                    className="flex items-center px-2 py-3 mx-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-[#494949] transition-colors"
                  >
                    <i className="fas fa-star mr-3 dark:text-white w-5 text-center"></i>
                    <span className='dark:text-white'>Favoritos</span>
                  </a>
                  <div className="border-t border-gray-200 dark:border-[#535353] my-1"></div>
                  <a
                    onClick={() => {
                      window.localStorage.clear();
                      navigate("/login")
                    }}
                    className="flex items-center px-2 py-3 m-2 rounded-xl text-sm text-red-600 hover:bg-[#FDEFEF] dark:text-[#EC7B7A] dark:hover:bg-[#4C3333] transition-colors cursor-pointer"
                  >
                    <i className="fas fa-sign-out-alt mr-3 w-5 text-center"></i>
                    <span>Sair</span>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64 py-4 border-gray-100' : 'max-h-0'
            }`}
        >
          <nav className="flex flex-col space-y-3">
            <a
              href="/gallery"
              className={`py-2 px-2 transition-colors ${isActiveLink('/gallery') ? 'text-black dark:text-white font-bold border-l-4 pl-3' : 'text-gray-700 dark:text-gray-100 hover:text-black dark:hover:text-gray-300 pl-4 font-medium'}`}
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