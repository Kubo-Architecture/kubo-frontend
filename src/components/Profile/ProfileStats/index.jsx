export default function ProfileStats(props){
    return(
        <div className="h-[160px] w-100% bg-white flex pt-[8px] px-[20px]">
            <div className="w-full h-full flex">
                <div className="w-full h-full bg-amber-400 flex justify-start items-center">
                    <h3>{props.name}</h3>
                </div>
                <div className="w-full h-full bg-amber-950"></div>
            </div>
            <div className="bg-green-500 w-10 h-full flex justify-center items-start">
                <a href="#">
                    <img src="src/assets/Profile/pen.svg" alt="Edit profile icon" />
                </a>
            </div>
        </div>
    )
}