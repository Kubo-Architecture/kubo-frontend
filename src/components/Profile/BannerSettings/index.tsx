import { useState } from "react";
import axios from "axios";
import BannerOption from "../BannerOption";

export default function BannerSettings() {
  const [bannerAtual, setBannerAtual] = useState<any>(null);

  const backgrounds: string[] = [
    "/src/assets/Profile/Banners/blue.png",
    "/src/assets/Profile/Banners/green.png",
    "/src/assets/Profile/Banners/black.png",
    "/src/assets/Profile/Banners/orange.png"
  ];

  const salvarBanner = async () => {
    try {
      const idUser: string = localStorage.getItem("idUser") ?? "";
      const formData = new FormData();
      formData.append("idUser", idUser);
      formData.append("path", bannerAtual);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/banner`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.status === 200) {
        window.location.reload();
      } else {
        alert("Erro ao salvar banner.");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro na requisição.");
    }
  };

  return (
    <div className="fixed top-[80px] left-0 right-0 h-[calc(100vh-80px)] bg-[#000000b4] flex justify-center items-center z-50">
      <div className="w-full max-w-[800px] max-h-[calc(100vh-80px)] bg-white shadow-lg p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Escolha o seu banner</h2>

        <div className="flex flex-col gap-4">
          {backgrounds.map((bg) => (
            <BannerOption
              key={bg}
              background={bg}
              selected={bannerAtual === bg}
              onSelect={setBannerAtual}
            />
          ))}
        </div>

        <div className="h-[150px] flex flex-col justify-end items-center gap-[10px]">
          <a
            href=""
            className="bg-[#4A4A4A] text-white flex justify-center items-center h-[40px] w-[250px] rounded-[30px] hover:bg-[#363636] disabled:bg-gray-400"
          >
            Voltar
          </a>
          <button
            onClick={salvarBanner}
            disabled={!bannerAtual}
            className="bg-[#4A4A4A] text-white h-[40px] w-[250px] rounded-[30px] hover:bg-[#363636] cursor-pointer disabled:bg-gray-400"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
