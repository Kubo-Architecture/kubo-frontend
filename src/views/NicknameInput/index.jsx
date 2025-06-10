import KuboIcon from "../../assets/icons/Universal/kubo-main-icon.svg"

export default function NicknameInput(){
    return(
        <div className="h-screen w-full">
            <header className="h-[80px] flex justify-center items-center">
                <a href="/">
                    <img className="h-[30px]" src={KuboIcon} alt="kubo icon" />
                </a>
            </header>
            <div className="h-full"></div>
        </div>
    )
}