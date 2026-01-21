export default function Biografy({bio}: {bio: string}) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <p className="font-montserrat text-base text-black dark:text-white">{bio}</p>
        </div>
    )
}