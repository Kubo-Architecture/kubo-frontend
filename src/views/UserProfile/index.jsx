import ProfileInnerHeader from "../../components/Profile/ProfileInnerHeader"
import ProfileStats from "../../components/Profile/ProfileStats"
import MainHeader from "../../components/Universal/MainHeader"

export default function UserProfile(){
    return(
        <div className="w-screen h-screen">
            <MainHeader/>
            <ProfileInnerHeader/>
            <ProfileStats name="Bruno Soterio" seguidores={0} likes={0} projetos={0}/>
        </div>
    )
}