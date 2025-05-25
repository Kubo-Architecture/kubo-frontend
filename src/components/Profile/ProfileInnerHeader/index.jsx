export default function ProfileInnerHeader(){
    return(
        <div className="h-[150px] w-screen bg-[#C4C4C4] flex px-[20px] relative justify-end">
            <div className="h-[150px] w-[150px] rounded-full bg-[url('src/assets/Profile/defaultProfile.svg')] bg-cover border-white border-3 absolute left-[20px] top-15">
            </div>
            <div className="w-[30px] h-[30px] bg-white rounded-full flex justify-center items-center my-[10px]">
                <a href="#">
                    <img src="src/assets/Profile/pen.svg" alt="" />
                </a>
            </div>
        </div>
    )
}