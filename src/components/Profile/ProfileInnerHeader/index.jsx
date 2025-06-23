import { useRef } from "react";
import PenIcon from "../../../assets/Profile/pen.svg";
import DefaultProfile from "../../../assets/Profile/defaultProfile.svg";

export default function ProfileInnerHeader(props) {
  const fileInputRef = useRef(null);

  const profileImageUrl = props.photoUrl?.trim()
    ? `url(${props.photoUrl})`
    : `url(${DefaultProfile})`;

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Formato inválido. Apenas PNG e JPG são permitidos.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Imagem muito grande. O limite é 5MB.");
      return;
    }

    const idUser = localStorage.getItem("idUser");
    if (!idUser) {
      alert("Usuário não autenticado.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("idUser", idUser);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/photo`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao enviar imagem.");

      alert("Foto de perfil atualizada com sucesso!");
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className="h-[150px] md:h-[200px] lg:h-[300px] xl:h-[350px] w-screen  min-w-[380px] flex px-[20px] md:px-[30px] relative justify-end"
      style={{
        backgroundColor: props.banner ? undefined : "#C4C4C4",
        backgroundImage: props.banner ? `url(${props.banner})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="h-[160px] md:h-[240px] lg:h-[320px] xl:h-[370px] w-[160px] md:w-[240px] lg:w-[320px] xl:w-[370px] rounded-full bg-cover border-white border-3 absolute left-[20px] md:left-[40px] lg:left-[50px] xl:left-[60px] top-[45px] md:top-[60px] lg:top-[70px] xl:top-[110px] hover:cursor-pointer"
        style={{ backgroundImage: profileImageUrl }}
        onClick={handleProfileImageClick}
        title="Clique para trocar a foto de perfil"
      />

      {/* input invisível */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/png, image/jpeg"
        onChange={handleImageChange}
      />

      <button
        className="w-[30px] h-[30px] bg-white rounded-full flex justify-center items-center my-[10px] md:my-[20px] hover:cursor-pointer"
        onClick={props.onEditBannerClick}
      >
        <img src={PenIcon} alt="Editar banner" />
      </button>
    </div>
  );
}
