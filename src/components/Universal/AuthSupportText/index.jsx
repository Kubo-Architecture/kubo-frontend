export default function AuthSupportText(props){
    return(
        <div className="support-text-container">
            <h3>{props.greeting}</h3>
            <p>{props.redirectMessage}<a href={props.destination}>{props.navigator}</a></p>
        </div>
    )
}