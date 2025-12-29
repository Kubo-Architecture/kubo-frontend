import { useParams } from "react-router-dom";
import { SimpleHeader } from "../../components/Universal/SimpleHeader";
import KuboEmptyIcon from "../../assets/icons/Universal/kubo-empty.svg";

export default function ErrorPage() {
    const { errorCode } = useParams();
    
    return (
        <div className="min-h-[400px] min-w-[340px] flex flex-col h-screen w-full px-[25px] max-[340px]:sticky max-[340px]:overflow-x-scroll">
            <div className="my-[30px]">
                <SimpleHeader />
            </div>
            <div className="flex-1 flex items-center justify-center relative">
                <img 
                    className="w-[200px] h-auto" 
                    src={KuboEmptyIcon} 
                    alt="Empty icon" 
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black">
                    <h4 className="font-['Montserrat'] font-medium tracking-[3px] text-[40px] text-center">
                        {errorCode}
                    </h4>
                </div>
            </div>
        </div>
    );
}