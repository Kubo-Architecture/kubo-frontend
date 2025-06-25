export default function Biografy(props){
    return(
        <div className="w-full min-w-[380px] mt-[20px] mb-[20px] px-[20px] md:px-[30px] lg:px-[40px] xl:px-[70px]">
            <p className="font-montserrat text-base">{props.Biografy}</p>
        </div>
    )
}