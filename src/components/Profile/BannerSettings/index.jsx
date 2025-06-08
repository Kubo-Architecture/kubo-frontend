// components/BannerSettings.jsx
import { useState } from "react";
import BannerOption from "../BannerOption";

export default function BannerSettings({ onClose }) {
  const [bannerAtual, setBannerAtual] = useState(null);

  const backgrounds = [
    "/src/assets/Profile/Banners/blue.png",
    "/src/assets/Profile/Banners/green.png",
    "/src/assets/Profile/Banners/black.png",
    "/src/assets/Profile/Banners/orange.png"
  ];

  const salvarBanner = async () => {
    try {
      const response = await fetch("/api/salvar-banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ defaultBanner: bannerAtual }),
      });

      if (response.ok) {
        alert("Banner salvo com sucesso!");
        onClose?.(); // fecha modal, se onClose estiver definido
      } else {
        alert("Erro ao salvar banner.");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro na requisição.");
    }
  };

  return (
    <div className="fixed top-[80px] left-0 right-0 h-[calc(100vh-80px)] bg-[#000000b4] flex justify-center items-end">
      <div className="h-full w-full max-w-[800px] bg-white relative shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Escolha o seu banner</h2>

        <div className="flex pt-[50px] h-full w-full justify-start items-center gap-4 flex-col overflow-y-auto">
          {backgrounds.map((bg) => (
            <BannerOption
              key={bg}
              background={bg}
              selected={bannerAtual === bg}
              onSelect={setBannerAtual}
            />
          ))}
        </div>

        <div className="absolute bottom-6 right-6">
          <button
            onClick={salvarBanner}
            disabled={!bannerAtual}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Salvar no fundo da tela
          </button>
        </div>
      </div>
    </div>
  );
}
