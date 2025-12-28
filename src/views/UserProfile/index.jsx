// ProfileInnerHeader.jsx (versão minimalista)
import React from "react";

const ProfileInnerHeader = ({ banner, photoUrl, ownProfile, onEditBannerClick }) => {
  return (
    <div className="relative w-full h-64">
      {/* Banner */}
      <div 
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        {ownProfile && (
          <button 
            onClick={onEditBannerClick}
            className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded"
          >
            Editar banner
          </button>
        )}
      </div>

      {/* Imagem do perfil */}
      <div className="absolute -bottom-12 left-8">
        <div 
          className="relative w-28 h-28 rounded-full border-4 border-white overflow-hidden group"
          style={{ 
            backgroundImage: `url(${photoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Overlay com lápis */}
          {ownProfile && (
            <div 
              className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all duration-300"
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInnerHeader;