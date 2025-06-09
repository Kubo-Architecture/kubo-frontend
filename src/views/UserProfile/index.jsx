import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import ProfileInnerHeader from "../../components/Profile/ProfileInnerHeader"
import ProfileStats from "../../components/Profile/ProfileStats"
import MainHeader from "../../components/Universal/MainHeader"
import Loading from "../../components/Universal/Loading"
import BannerSettings from "../../components/Profile/BannerSettings"
import Biografy from "../../components/Profile/Biografy"

export default function UserProfile() {
    const location = useLocation()
    const navigate = useNavigate()
    const [profileData, setProfileData] = useState(null)
    const [showBannerSettings, setShowBannerSettings] = useState(false)

    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean)
        const username = pathSegments[1]

        const apiUrl = `${import.meta.env.VITE_API_URL}/profile/${username}`

        axios.get(apiUrl)
            .then((res) => {
                console.log("Dados do perfil:", res.data)
                setProfileData(res.data)
            })
            .catch((err) => {
                console.error("Erro ao buscar perfil:", err)
                if (err.code === "ERR_NETWORK" || err.response?.status === 404){
                    navigate('/error/404')
                }
            })
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
            <MainHeader photoUrl={profileData.photoUrl} />
            <ProfileInnerHeader
                banner={profileData.banner}
                photoUrl={profileData.photoUrl}
                onEditBannerClick={() => setShowBannerSettings(true)}
            />
            <ProfileStats
                name={profileData.name}
                nickname={profileData.nickname}
                seguidores={profileData.followers || 0}
                likes={profileData.likes || 0}
                projetos={profileData.projects || 0}
            />
            <Biografy Biografy={profileData.bio}/>

            {showBannerSettings && (
                <div className="z-50">
                    <BannerSettings onClose={() => setShowBannerSettings(false)} />
                </div>
            )}
        </div>
    )
}
