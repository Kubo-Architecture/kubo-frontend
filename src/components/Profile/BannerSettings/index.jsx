import BannerOption from "../BannerOption"
export default function BannerSettings({ onClose }) {
    return (
        <div className="h-screen w-screen bg-[#000000b4] flex justify-center items-end">
            <div className="h-full w-full max-w-[800px] bg-white relative shadow-lg p-6"> 
                <h2 className="text-xl font-semibold mb-4">Escolha o seu banner</h2>
                <div className="flex pt-[50px] h-full w-full justify-start items-center gap-4 flex-col">
                    <BannerOption background="green"/>
                    <BannerOption background="red"/>
                </div>
                
            </div>
        </div>
    )
}
