import "./styles.css"

export default function AuthSupportText(props: any) {
    return (
        <div className="support-text-container">
            <h3>{props.greeting}</h3>
            <p>{props.redirectMessage}<a href={props.destination}><strong>{props.navigator}</strong></a></p>
        </div>
    )
}