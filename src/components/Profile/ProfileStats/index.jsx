import PenIcon from "../../../assets/Profile/pen.svg"

export default function ProfileStats(props){
    return(
        <div className="h-[220px] min-w-[380px] w-full bg-white flex pt-[8px] px-[20px]">
            <div className="flex-grow h-full flex flex-col">
                <div className="w-full h-3/4 flex justify-start items-end">
                    <h3 className="font-semibold text-[30px]">{props.name}</h3>
                </div>
                <div className="w-full h-1/4 flex items-center gap-5">
                <p><strong className="text-[25px] font-medium">{props.projetos}</strong> Projetos</p>
                <p><strong className="text-[25px] font-medium">{props.likes}</strong> Likes</p>
                <p> <strong className="text-[25px] font-medium">{props.seguidores}</strong> Seguidores</p>
                </div>
            </div>
            <div className="w-10 h-full flex justify-end items-start">
                <a href="#">
                    <img src={PenIcon} alt="Edit profile icon" />
                </a>
            </div>
        </div>

    )
}