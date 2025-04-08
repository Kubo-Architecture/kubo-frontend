import HomeHeader from "../../components/Home/HomeHeader"
import "./styles.css"

export default function Home(){
    return(
        <div className="home-container">
            <HomeHeader/>
            <HomeBody/>
        </div>
    )
}