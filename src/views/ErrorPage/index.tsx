import { useParams } from "react-router-dom";
import KuboEmptyIcon from "../../assets/icons/Universal/kubo-empty.svg";

export default function ErrorPage() {
    const { errorCode } = useParams<string>();

    return (
        <div className="error-page-container">
            <div className="empty-icon-container">
                <img className="icon" src={KuboEmptyIcon} alt="Empty icon" />
                <div className="error-status">
                    <h4>{errorCode}</h4>
                </div>
            </div>
        </div>
    );
}