import HomeHeader from "../../components/Home/HomeHeader"
import HomeBody from "../../components/Home/HomeBody"
import "./styles.css"

export default function Home(){
    return(
        <div className="home-container">
            <HomeHeader/>
            <HomeBody/>
        </div>
    )
}