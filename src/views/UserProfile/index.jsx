import ProfileInnerHeader from "../../components/Profile/ProfileInnerHeader"
import MainHeader from "../../components/Universal/MainHeader"

export default function UserProfile(){
    return(
        <div className="w-screen h-screen">
            <MainHeader/>
            <ProfileInnerHeader/>
        </div>
    )
}