import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import ProfileInnerHeader from "../components/Profile/ProfileInnerHeader"
import ProfileStats from "../components/Profile/ProfileStats"
import BannerSettings from "../components/Profile/BannerSettings"
import Biografy from "../components/Profile/Biografy"
import ProjectGallery from "../components/Profile/ProjectGallery"
import Loading from "../components/Universal/Loading"

export default function UserProfile() {
  const [loading, setLoading] = useState<ConstrainBoolean>(true);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  const location = useLocation()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState<any>(null)
  const [showBannerSettings, setShowBannerSettings] = useState<boolean>(false)
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean)
    const currentUserId = window.localStorage.getItem('idUser');
    const username = pathSegments[1]

    const apiUrl = `${import.meta.env.VITE_API_URL}/profile/${username}`

    axios.get(apiUrl)
      .then((res) => {
        if (res.data.nickname === "") {
          navigate("/profile/nickname")
        }

        setIsOwnProfile(res.data.idUser == currentUserId);
        setProfileData(res.data)
      })
      .catch((err) => {
        console.error("Erro ao buscar perfil:", err)
        if (err.code === "ERR_NETWORK" || err.response?.status === 404) {
          navigate("/error/404")
        }
      })
  }, [location])

  // Função para fechar o modal de banner
  const handleCloseBannerSettings = () => {
    setShowBannerSettings(false);
  };

  // Função para atualizar o banner após salvar
  const handleBannerUpdated = (newBanner: string) => {
    console.log("Banner atualizado:", newBanner);
    // Atualiza o banner no profileData
    setProfileData((prev: any) => ({
      ...prev,
      banner: newBanner
    }));
  };

  if (!profileData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <div className="pt-16">
        {loading && <Loading />}
        <div className={loading ? "hidden" : "block"}>
          <ProfileInnerHeader
            banner={profileData.banner}
            photoUrl={profileData.photoUrl}
            ownProfile={isOwnProfile}
            onEditBannerClick={() => setShowBannerSettings(true)}
          />
          <ProfileStats
            name={profileData.nickname}
            nickname={profileData.name}
            seguidores={profileData.followers || 0}
            likes={profileData.likes || 0}
            projetos={projectCount || 0}
            ownProfile={isOwnProfile}
            userId={profileData.idUser}
            onFollowChange={(isFollowing: boolean) => {
              setProfileData((prev: any) => ({
                ...prev,
                followers: isFollowing ? (prev.followers || 0) + 1 : Math.max(0, (prev.followers || 0) - 1)
              }));
            }}
          />
          <Biografy Biografy={profileData.bio} />

          <ProjectGallery userId={profileData.idUser} onProjectsLoaded={(count: number) => setProjectCount(count)} setIsLoadingChild={setLoading} />

          {showBannerSettings && (
            <BannerSettings 
              onClose={handleCloseBannerSettings}
              onBannerUpdated={handleBannerUpdated}
            />
          )}
        </div>
      </div>
    </div>
  )
}