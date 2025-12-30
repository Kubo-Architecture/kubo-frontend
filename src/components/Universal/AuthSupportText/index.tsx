export default function AuthSupportText(props) {
  return (
    <div className="flex flex-col gap-[6px] h-[100px] flex-shrink-0">
      <h3 className="text-[26px] font-montserrat font-light large-screen:text-[30px]">
        {props.greeting}
      </h3>
      <p className="font-montserrat font-extralight text-[13px] pl-[4px] large-screen:text-[16px]">
        {props.redirectMessage}
        <a 
          href={props.destination} 
          className="no-underline text-[#29435E] font-light px-[4px]"
        >
          <strong>{props.navigator}</strong>
        </a>
      </p>
    </div>
  );
}