import { useMemo } from "react";
import banner1 from '../../../assets/images/loginImage.svg';
import banner2 from '../../../assets/images/banner-1.svg';
import banner3 from '../../../assets/images/banner-2.svg';

export default function LoginBanner({ className = "", alt = "Login banner" }) {
  const images = [banner1, banner2, banner3];

  const randomImage = useMemo(() => {
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <img 
        src={randomImage} 
        alt={alt} 
        className="w-full h-full object-cover rounded-[20px] block"
      />
      <div className="absolute top-[20px] left-[30px] font-['Montserrat'] text-white text-[20px] select-none">
        Kubo
      </div>
      <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 font-['Montserrat'] text-white text-[20px] select-none">
        Explore do seu jeito
      </div>
    </div>
  );
}