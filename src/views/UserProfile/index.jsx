import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import ProfileInnerHeader from "../../components/Profile/ProfileInnerHeader"
import ProfileStats from "../../components/Profile/ProfileStats"
import BannerSettings from "../../components/Profile/BannerSettings"
import Biografy from "../../components/Profile/Biografy"
import ProjectGallery from "../../components/Profile/ProjectGallery"
import Loading from "../../components/Universal/Loading"
import HeaderFull  from "../../components/Universal/HeaderFull/index"



export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const location = useLocation()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [showBannerSettings, setShowBannerSettings] = useState(false)
  const [projectCount, setProjectCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = {
    name: "Kubo",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100",
    role: "Arquiteto"
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    const pathSegments = location.pathname.split("/").filter(Boolean)
    const username = pathSegments[1]

    const apiUrl = `${import.meta.env.VITE_API_URL}/profile/${username}`

    axios.get(apiUrl)
      .then((res) => {
        if (res.data.nickname === "") {
          navigate("/profile/nickname")
        }
        console.log("Dados do perfil:", res.data)
        setProfileData(res.data)
      })
      .catch((err) => {
        console.error("Erro ao buscar perfil:", err)
        if (err.code === "ERR_NETWORK" || err.response?.status === 404) {
          navigate("/error/404")
        }
      })

    return () => clearTimeout(timer);
  }, [location])

  if (!profileData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <div className="w-screen min-h-screen relative overflow-hidden">
      {/* Header fixo */}
      <HeaderFull/>

      {/* Conteúdo principal */}
      <div className="pt-16">
        {loading ? (
          <Loading />
        ) : (
          <>
            <ProfileInnerHeader
              banner={profileData.banner}
              photoUrl={profileData.photoUrl}
              onEditBannerClick={() => setShowBannerSettings(true)}
            />
            <ProfileStats
              name={profileData.nickname}
              nickname={profileData.name}
              seguidores={profileData.followers || 0}
              likes={profileData.likes || 0}
              projetos={projectCount || 0}
            />
            <Biografy Biografy={profileData.bio} />

            <ProjectGallery onProjectsLoaded={(count) => setProjectCount(count)} />

            {showBannerSettings && (
              <div className="z-50">
                <BannerSettings onClose={() => setShowBannerSettings(false)} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}'            '