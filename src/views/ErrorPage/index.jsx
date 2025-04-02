import "./styles.css";
import { useParams } from "react-router-dom";
import { SimpleHeader } from "../../components/Universal/SimpleHeader";
import KuboEmptyIcon from "../../assets/icons/Universal/kubo-empty.svg";

export default function ErrorPage() {
    const { errorCode } = useParams();
    
    return (
        <div className="error-page-container">
            <SimpleHeader />
            <div className="empty-icon-container">
                <img className="icon" src={KuboEmptyIcon} alt="Empty icon" />
                <div className="error-status">
                    <h4>{errorCode}</h4>
                </div>
            </div>
        </div>
    );
}
