import { useState, useEffect } from 'react';
import { close, logo, menu } from "../../public/assets";
import { navLinks } from "@/constants";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from "react";

const Navbar: React.FC = () => {
  const [toggle, setToggle] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }
  }, []);

  const SignInToggle = () => {
    if (isLoggedIn) {
      return (
        <button
          className="mt-4 py-2 px-5 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
          onClick={() => { setToggle(false); router.push('/dashboard'); }}
        >
          Go to Dashboard
        </button>
      );
    } else {
      return (
        <button
          className="mt-4 py-2 px-5 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
          onClick={() => { setToggle(false); router.push('/signin'); }}
        >
          Sign In
        </button>
      );
    }
  };

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar bg-[#0a0a23]">
      <Image src={logo} alt="HooBank" width={124} height={32} />
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] text-blue-400 hover:text-white ${index === navLinks.length - 1 ? 'mr-0' : 'mr-10'}`}>
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
        <li>
          {isLoggedIn ? (
            <button
              className="ml-6 py-2 px-5 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              className="ml-6 py-2 px-5 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
              onClick={() => router.push('/signin')}
            >
              Sign In
            </button>
          )}
        </li>
      </ul>
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <Image src={toggle ? close : menu}
          alt="menu"
          className="object-contain"
          width={28}
          height={28}
          onClick={() => setToggle((prev) => !prev)} />
        <div className={`${toggle ? 'flex' : 'hidden'}
            p-6 bg-gradient-to-br from-blue-900 to-[#0a0a23] absolute top-20 ring-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}>
          <ul className="list-none flex flex-col justify-end items-center flex-1">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-normal cursor-pointer text-[16px] text-blue-400 hover:text-white ${index === navLinks.length - 1 ? 'mr-0' : 'mb-4'}`}>
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
            <li>
              <SignInToggle />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;