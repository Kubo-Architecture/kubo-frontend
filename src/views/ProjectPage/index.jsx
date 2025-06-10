import IconWithPanel from "../../components/Universal/MainHeader";
import ProjectImage from "../../assets/images/project.svg";
import ChartIcon from "../../assets/icons/Project/chart.svg";
import EngineIcon from "../../assets/icons/Project/engine.svg";
import FavoriteIcon from "../../assets/icons/Project/favorite.svg";
import HouseIcon from "../../assets/icons/Project/house.svg";
import MaterialsIcon from "../../assets/icons/Project/materials.svg";
import MountainIcon from "../../assets/icons/Project/mountain.svg";
import PinIcon from "../../assets/icons/Project/pin.svg";
import UserIcon from "../../assets/icons/Project/user.svg";
import VerifyIcon from "../../assets/icons/Project/verify-post.svg";

export default function ProjectPage({ project }) {
    return (
        <>
            <IconWithPanel />
            <div className="flex flex-col w-full min-h-[calc(100vh-5rem)]">
                <div className="flex w-full h-12 justify-end items-center px-5 gap-5 lg:gap-10">
                    <div className="flex h-full items-center gap-1">
                        <span className="text-xs lg:text-base">Postagem verificada</span>
                        <div className="w-5 h-5">
                            <img className="w-full h-full object-cover" src={VerifyIcon} />
                        </div>
                    </div>
                    <div className="flex h-full items-center gap-1">
                        <span className="text-xs lg:text-base">Favorito</span>
                        <div className="w-5 h-5">
                            <img className="w-full h-full object-cover" src={FavoriteIcon} />
                        </div>
                    </div>
                </div>

                <div className="min-w-full h-70 md:h-90 lg:h-140">
                    <img className="w-full h-full object-cover" src={project.image} />
                </div>

                <div className="flex w-full h-8 justify-end items-center px-5 mb-5 gap-10">
                    <div className="flex h-full items-center gap-1">
                        <div className="w-4 h-4">
                            <img className="w-full h-full object-cover" src={UserIcon} />
                        </div>
                        <span className="font-light text-xs lg:text-sm">{project.user}</span>
                    </div>
                </div>

                <div className="flex flex-col w-full px-8">
                    <span className="text-4xl font-medium leading-7">{project.name}</span>
                    <span>por {project.owner}</span>
                    <div className="flex items-center gap-1">
                        <span className="text-xs lg:text-base">{project.place} {project.year}</span>
                        <div className="w-3 h-3">
                            <img className="w-full h-full object-cover" src={PinIcon} />
                        </div>
                    </div>

                    <span className="text-sm text-[#4f4f4f] mt-10 text-justify md:text-start
                                md:text-lg">
                        {project.description}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-y-5 gap-x-8 sm:gap-x-0 px-8 py-15 text-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11">
                            <img className="w-full h-full object-cover" src={MaterialsIcon} />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-4">Materiais</span>
                            <span className="font-light text-xs mt-1 leading-3">{project.materials}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11">
                            <img className="w-full h-full object-cover" src={ChartIcon} />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-4">Status</span>
                            <span className="font-light text-xs mt-1 leading-3">{project.status}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11">
                            <img className="w-full h-full object-cover" src={EngineIcon} />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-4">Uso</span>
                            <span className="font-light text-xs mt-1 leading-3">{project.use}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11">
                            <img className="w-full h-full object-cover" src={MountainIcon} />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-4">Área construída</span>
                            <span className="font-light text-xs mt-1 leading-3">{project.area}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11">
                            <img className="w-full h-full object-cover" src={HouseIcon} />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-4">Área construída</span>
                            <span className="font-light text-xs mt-1 leading-3">{project.area}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col px-8">
                    <span className="text-3xl font-medium mb-5">Galeria</span>
                    <div className="grid grid-cols-1 sm:grid-rows-2 sm:grid-cols-3 gap-1
                                lg:grid-rows-3">
                        <div className="rounded-sm sm:row-span-2 lg:row-span-3">
                            <img className="w-full h-full object-cover rounded-sm" src={project.image} />
                        </div>
                        <div className="rounded-sm">
                            <img className="w-full h-full object-cover rounded-sm" src={project.image} />
                        </div>
                        <div className="rounded-sm lg:row-span-2">
                            <img className="w-full h-full object-cover rounded-sm" src={project.image} />
                        </div>
                        <div className="rounded-sm lg:row-span-2">
                            <img className="w-full h-full object-cover rounded-sm" src={project.image} />
                        </div>
                        <div className="rounded-sm">
                            <img className="w-full h-full object-cover rounded-sm" src={project.image} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}