export default function Biografy({ bio }: { bio: string }) {
    const processedBio = bio.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    return (
        <div className="w-full bg-white dark:bg-[#131B24]">
            <div className="py-6 sm:py-8 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
                <p className="font-montserrat text-base leading-loose text-gray-800 dark:text-gray-200 break-words max-w-[85%] lg:max-w-[90%] xl:max-w-[85%]">
                    {processedBio}
                </p>
            </div>
        </div>
    )
}