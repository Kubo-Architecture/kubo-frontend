import IconWithPanel from "../../components/Universal/MainHeader";

export default function ProjectPage() {
    return (
        <>
        <IconWithPanel />
        <div className="flex w-full min-h-[calc(100vh-5rem)] bg-red-500">
            <div className="flex w-full h-12 justify-end items-center px-5 gap-10 bg-white">
                <div className="flex h-full items-center gap-2">
                    <span>Postagem verificada</span>
                    <div className="w-5 h-5 bg-gray-100"></div>
                </div>
                <div className="flex h-full items-center gap-2">
                    <span>Favorito</span>
                    <div className="w-5 h-5 bg-gray-100"></div>
                </div>
            </div>
        </div>
        </>
    )
}