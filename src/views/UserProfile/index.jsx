import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import ProfileInnerHeader from "../../components/Profile/ProfileInnerHeader"
import ProfileStats from "../../components/Profile/ProfileStats"
import MainHeader from "../../components/Universal/MainHeader"

export default function UserProfile() {
    const location = useLocation()

    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean)
        const username = pathSegments[0] // ex: "brunosoterio"

        const apiUrl = `${import.meta.env.VITE_API_URL}/profile/${username}`

        axios.get(apiUrl)
            .then((res) => {
                console.log("Dados do perfil:", res.data)
                // aqui você pode usar useState para guardar os dados se quiser
            })
            .catch((err) => {
                console.error("Erro ao buscar perfil:", err)
            })
    }, [location])

    return (
        <div className="w-screen h-screen">
            <MainHeader />
            <ProfileInnerHeader />
            <ProfileStats name="Bruno Soterio" seguidores={0} likes={0} projetos={0} />
        </div>
    )
}
