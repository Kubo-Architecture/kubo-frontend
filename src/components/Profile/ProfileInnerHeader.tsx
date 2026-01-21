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
        <div
          className={`h-[160px] md:h-[240px] lg:h-[320px] xl:h-[370px] w-[160px] md:w-[240px] shadow-2xl lg:w-[320px] xl:w-[370px] rounded-full bg-cover border-white dark:border-[#181E29] border-3 absolute left-[20px] md:left-[40px] lg:left-[50px] xl:left-[60px] top-[45px] md:top-[60px] lg:top-[70px] xl:top-[110px] ${
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

        {props.ownProfile && (
          <button
            className="w-[30px] h-[30px] bg-white rounded-full flex justify-center items-center my-[10px] md:my-[20px] hover:cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={props.onEditBannerClick}
          >
           <i className="fa-solid fa-pen"></i>
          </button>
        )}
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