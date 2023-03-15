import * as React from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import bankPng from "../bank.png";

const Navbar = ({ account, darkMode, setDarkMode }) => {
  return (
    <nav className="flex fixed top-0 w-full h-[80px] border-b border-b-slate-600 justify-between items-center px-5">
      <a className="flex items-center gap-x-2.5" href="#about">
        <img src={bankPng} className="w-14" alt="bank logo" />
        DAPP Yield Staking (Decentralized Banking)
      </a>
      <ul className="flex gap-x-3">
        <li className="flex items-center">
          <small className="">ACCOUNT NUMBER: {account}</small>
        </li>
        <li className="flex items-center">
          <button className="" onClick={() => setDarkMode((prev) => !prev)}>
            {darkMode ? (
              <SunIcon className="w-5" />
            ) : (
              <MoonIcon className="w-4" />
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
};
export default Navbar;
