import PenIcon from "../../../assets/Profile/pen.svg"

export default function ProfileStats(props) {
    return (
        <div className="h-[220px] min-w-[380px] w-full bg-white flex pt-[8px] px-[20px] md:px-[30px] lg:px-[40px] xl:px-[70px] md:mt-[10px] lg:mt-[18px]">
            <div className="flex-grow h-full flex flex-col lg:flex-row">
                <div className="w-full lg:w-[400px] xl:w-[500px] h-3/4 xl:h-full flex flex-col lg:whitespace-nowrap justify-end items-start">
                    <h3 className="font-normal text-[30px] font-montserrat">{props.nickname}</h3>
                    <p className="text-[#4d4d4d]">@{props.name}</p>
                </div>
                <div className="w-full lg:w-2/4 h-1/4 flex items-center gap-5 lg:gap-10">
                    <p className="text-[18px] lg:text-[23px]"><strong className="text-[21px] lg:text-[25px] pr-1">{props.projetos}</strong>{props.projetos > 1 ? 'Projetos' : 'Projeto'}</p>
                    <p className="text-[18px] lg:text-[23px]"><strong className="text-[21px] lg:text-[25px] pr-1">{props.likes}</strong> Likes</p>
                    <p className="text-[18px] lg:text-[23px]"> <strong className="text-[21px] lg:text-[25px] pr-1">{props.seguidores}</strong> Seguidores</p>
                </div>
            </div>
            {props.ownProfile && <div className="w-10 h-full flex justify-end items-start">
                <a href="#">
                    <img className="h-[20px] lg:h-[25px]" src={PenIcon} alt="Edit profile icon" />
                </a>
            </div>}
        </div>

    )
}