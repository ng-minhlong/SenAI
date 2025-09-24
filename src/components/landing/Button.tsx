"use client"; // nếu bạn dùng App Router, cần thêm dòng này

import { useRouter } from "next/navigation";
import { ButtonProps } from "../../types";

const Button: React.FC<ButtonProps> = ({ styles }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles} py-4 px-6 bg-gradient-to-r from-blue-700 to-blue-400 font-poppins font-medium text-[18px] text-white outline-none rounded-[10px] hover:from-blue-800 hover:to-blue-500 transition-all ease-linear cursor-pointer`}
    >
      Get Started
    </button>
  );
};

export default Button;
