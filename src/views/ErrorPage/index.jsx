export default function ErrorPage(){

    const { errorCode } = useParams();
    return(
        <div className="error-page-container">
            <h1>{errorCode}</h1>
        </div>
    )
}