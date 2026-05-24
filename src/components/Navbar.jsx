import React, { useState, useEffect } from "react";
import { Bug, SunMoon } from "lucide-react";

const Navbar = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div
      className="nav flex items-center justify-between px-20 h-[90px]"
    >
      <div className="flex items-center gap-3">
        <Bug size={38} color="#9333ea" />
        <h1 className="text-4xl font-bold text-blue-500">
          TheCodeFixer
        </h1>
      </div>

      <button onClick={toggleTheme}>
        <SunMoon
          size={35}
          className="cursor-pointer hover:text-[#9333ea] transition-all"
        />
      </button>
    </div>
  );
};

export default Navbar;