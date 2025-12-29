<<<<<<< HEAD:src/components/Universal/AuthSupportText/index.jsx
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
=======
import "./styles.css"

export default function AuthSupportText(props: any) {
    return (
        <div className="support-text-container">
            <h3>{props.greeting}</h3>
            <p>{props.redirectMessage}<a href={props.destination}><strong>{props.navigator}</strong></a></p>
        </div>
    )
>>>>>>> cd298b3dff23dc77ed6005f23a7044be060e3736:src/components/Universal/AuthSupportText/index.tsx
}