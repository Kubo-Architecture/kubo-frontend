export default function Biografy({bio}: {bio: string}) {
    return (
        <div className="w-full min-w-[380px] mt-[20px] mb-[20px] px-[20px] md:px-[30px] lg:px-[40px] xl:px-[70px]">
            <p className="font-montserrat text-base text-black dark:text-white">{bio}</p>
        </div>
    )
}