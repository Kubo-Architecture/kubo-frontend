import { useState } from "react";
import DefaultProfile from "../../assets/Profile/defaultProfile.svg";
import PhotoEditorModal from "../Profile/PhotoEditorModal";

export default function ProfileInnerHeader(props: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const profileImageUrl = props.photoUrl?.trim()
    ? `url(${props.photoUrl.replace(/=s\d+(-c)?$/, "=s400-c")})`
    : `url(${DefaultProfile})`;

  const handleImageClick = () => {
    if (props.ownProfile) {
      setIsModalOpen(true);
    }
  };

  const handlePhotoUpdate = () => {
    window.location.reload();
  };

  return (
    <>
      <div
        className="h-[150px] md:h-[200px] lg:h-[300px] xl:h-[350px] w-screen min-w-[380px] flex px-[20px] md:px-[110px] relative justify-end"
        style={{
          backgroundColor: props.banner ? undefined : "#C4C4C4",
          backgroundImage: props.banner ? `url(${props.banner})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Botão de Editar Banner - só aparece no próprio perfil */}
        {props.ownProfile && props.onEditBannerClick && (
          <button
            onClick={props.onEditBannerClick}
            className="absolute top-4 right-4 md:right-8 bg-white hover:bg-gray-100 text-neutral-700 w-9 h-9 md:w-10 md:h-10 rounded-full transition-all shadow-md hover:shadow-lg z-10 flex items-center justify-center"
            aria-label="Editar banner"
          >
            <i className="fa-solid fa-pen text-xs md:text-sm"></i>
          </button>
        )}

        <div
          className={`h-[160px] md:h-[240px] lg:h-[320px] xl:h-[370px] w-[160px] md:w-[240px] shadow-2xl lg:w-[320px] xl:w-[370px] rounded-full bg-cover border-white border-3 absolute left-[20px] md:left-[40px] lg:left-[50px] xl:left-[60px] top-[45px] md:top-[60px] lg:top-[70px] xl:top-[110px] ${
            props.ownProfile ? "hover:cursor-pointer group" : ""
          }`}
          style={{ backgroundImage: profileImageUrl }}
          onClick={handleImageClick}
        >
          {props.ownProfile && (
            <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full rounded-full bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
              <i className="fa-solid fa-pen text-white text-3xl md:text-4xl lg:text-5xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
            </div>
          )}
        </div>
      </div>

      {props.ownProfile && (
        <PhotoEditorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentPhotoUrl={props.photoUrl}
          onPhotoUpdate={handlePhotoUpdate}
        />
      )}
    </>
  );
}