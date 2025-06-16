import { useMemo } from "react";
import banner1 from '../../../assets/images/loginImage.svg';
import banner2 from '../../../assets/images/banner-1.svg';
import banner3 from '../../../assets/images/banner-2.svg';
import './style.css'

export default function LoginBanner({ className = "", alt = "Login banner" }) {
  const images = [
    banner1,
    banner2,
    banner3
  ];

  const randomImage = useMemo(() => {
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  }, []);

  return <img src={randomImage} alt={alt} className={`login-banner ${className}`} />;
}
