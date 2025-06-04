import PenIcon from "../../../assets/Profile/pen.svg"

export default function ProfileInnerHeader(props) {
    const profileImageUrl = props.photoUrl?.trim()
        ? `url(${props.photoUrl})`
        : `url('src/assets/Profile/defaultProfile.svg')`;

    return (
        <div
        className="h-[150px] w-screen flex px-[20px] relative justify-end"
        style={{
            backgroundColor: props.banner ? undefined : "#C4C4C4",
            backgroundImage: props.banner ? `url(${props.banner})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >
            <div
                className="h-[160px] w-[160px] rounded-full bg-cover border-white border-3 absolute left-[20px] top-13"
                style={{ backgroundImage: profileImageUrl }}
            />
            <div className="w-[30px] h-[30px] bg-white rounded-full flex justify-center items-center my-[10px]">
                <a href="#">
                    <img src={PenIcon} alt="" />
                </a>
            </div>
        </div>
    );
}
