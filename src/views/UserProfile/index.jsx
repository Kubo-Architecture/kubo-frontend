import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import ProfileInnerHeader from "../../components/Profile/ProfileInnerHeader"
import ProfileStats from "../../components/Profile/ProfileStats"
import BannerSettings from "../../components/Profile/BannerSettings"
import Biografy from "../../components/Profile/Biografy"
import ProjectGallery from "../../components/Profile/ProjectGallery"
import Loading from "../../components/Universal/Loading"
import HeaderFull from "../../components/Universal/HeaderFull/index"

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const location = useLocation()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [showBannerSettings, setShowBannerSettings] = useState(false)
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
          />
          <Biografy Biografy={profileData.bio} />

          <ProjectGallery userId={profileData.idUser} onProjectsLoaded={(count) => setProjectCount(count)} setIsLoadingChild={setLoading} />

          {showBannerSettings && (
            <div className="z-50">
              <BannerSettings onClose={() => setShowBannerSettings(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}