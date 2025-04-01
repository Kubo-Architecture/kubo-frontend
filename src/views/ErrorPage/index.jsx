import "./styles.css"
import { useParams } from "react-router-dom";
import { SimpleHeader } from "../../components/Universal/SimpleHeader";

export default function ErrorPage(){

    const { errorCode } = useParams();
    return(
        <div className="error-page-container">
            <SimpleHeader />
            <div className="error-status">
                <h4>{errorCode}</h4>
            </div>
        </div>
    )
}