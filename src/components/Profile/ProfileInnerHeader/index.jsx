import PenIcon from "../../../assets/Profile/pen.svg";
import DefaultProfile from "../../../assets/Profile/defaultProfile.svg";

export default function ProfileInnerHeader(props) {
  const profileImageUrl = props.photoUrl?.trim()
    ? `url(${props.photoUrl})`
    : `url(${DefaultProfile})`;

  return (
    <div
      className="h-[150px] md:h-[200px] lg:h-[300px] xl:h-[350px] w-screen  min-w-[380px] flex px-[20px] md:px-[30px] relative justify-end"
      style={{
        backgroundColor: props.banner ? undefined : "#C4C4C4",
        backgroundImage: props.banner ? `url(${props.banner})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="h-[160px] md:h-[240px] lg:h-[320px] xl:h-[370px] w-[160px] md:w-[240px] lg:w-[320px] xl:w-[370px] rounded-full bg-cover border-white border-3 absolute left-[20px] md:left-[40px] lg:left-[50px] xl:left-[60px] top-[45px] md:top-[60px] lg:top-[70px] xl:top-[110px]"
        style={{ backgroundImage: profileImageUrl }}
      />
      <button
        className="w-[30px] h-[30px] bg-white rounded-full flex justify-center items-center my-[10px] md:my-[20px] hover:cursor-pointer"
        onClick={props.onEditBannerClick}
      >
        <img src={PenIcon} alt="Editar banner" />
      </button>
    </div>
  );
}
