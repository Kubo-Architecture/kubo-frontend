import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import ProfileInnerHeader from "../../components/Profile/ProfileInnerHeader"
import ProfileStats from "../../components/Profile/ProfileStats"
import MainHeader from "../../components/Universal/MainHeader"

export default function UserProfile() {
    const location = useLocation()
    const [profileData, setProfileData] = useState(null)

    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean)
        const username = pathSegments[1]

        const apiUrl = `${import.meta.env.VITE_API_URL}/profile/${username}`

        axios.get(apiUrl)
            .then((res) => {
                console.log("Dados do perfil:", res.data)
                setProfileData(res.data) // Armazena os dados
            })
            .catch((err) => {
                console.error("Erro ao buscar perfil:", err)
            })
    }, [location])

    return (
        <div className="w-screen h-screen">
            <MainHeader />
            {profileData && (
                <ProfileInnerHeader 
                photoUrl={profileData.photoUrl || "src/assets/Profile/defaultProfile.svg"}
                />
            )}
            

            {profileData && (
                <ProfileStats
                    name={profileData.name}
                    seguidores={profileData.followers || 0}
                    likes={profileData.likes || 0}
                    projetos={profileData.projects || 0}
                />
            )}
        </div>
    )
}
