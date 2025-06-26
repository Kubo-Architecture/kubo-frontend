import { useRef } from "react";
import PenIcon from "../../../assets/Profile/pen.svg";
import DefaultProfile from "../../../assets/Profile/defaultProfile.svg";
import axios from "axios";

export default function ProfileInnerHeader(props) {
  const fileInputRef = useRef(null);

  const profileImageUrl = props.photoUrl?.trim()
    ? `url(${props.photoUrl})`
    : `url(${DefaultProfile})`;

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const idUser = localStorage.getItem("idUser");

    if (!file || !idUser) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.");
      return;
    }

    const apiUrl = `${import.meta.env.VITE_API_URL}/user/photo`;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("idUser", idUser);

    try {
      const response = await axios.put(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload feito com sucesso:", response.data);

      if (response.status === 200) {
        window.location.reload();
      } else {
        alert("Erro ao salvar imagem.");
      }
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      alert(error.response?.data?.error || "Erro ao enviar imagem.");
    }
  };

  return (
    <div
      className="h-[150px] md:h-[200px] lg:h-[300px] xl:h-[350px] w-screen min-w-[380px] flex px-[20px] md:px-[30px] relative justify-end"
      style={{
        backgroundColor: props.banner ? undefined : "#C4C4C4",
        backgroundImage: props.banner ? `url(${props.banner})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Imagem de perfil com overlay */}
      <div
        className="h-[160px] md:h-[240px] lg:h-[320px] xl:h-[370px] w-[160px] md:w-[240px] lg:w-[320px] xl:w-[370px] rounded-full bg-cover border-white border-3 absolute left-[20px] md:left-[40px] lg:left-[50px] xl:left-[60px] top-[45px] md:top-[60px] lg:top-[70px] xl:top-[110px] hover:cursor-pointer group overflow-hidden"
        style={{ backgroundImage: profileImageUrl }}
        onClick={handleImageClick}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-50 flex items-center justify-center transition-opacity duration-300 pointer-events-none">
          <span className="text-white text-6xl font-light">+</span>
        </div>
      </div>

      {/* Input escondido */}
      <input
        type="file"
        accept="image/png, image/jpeg"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Botão de editar banner */}
      <button
        className="w-[30px] h-[30px] bg-white rounded-full flex justify-center items-center my-[10px] md:my-[20px] hover:cursor-pointer"
        onClick={props.onEditBannerClick}
      >
        <img src={PenIcon} alt="Editar banner" className="h-[20px]" />
      </button>
    </div>
  );
}
