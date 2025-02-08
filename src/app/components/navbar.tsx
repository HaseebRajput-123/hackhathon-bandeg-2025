"use client";
import Link from "next/link";
import {
  FaSearch,
  FaShoppingCart,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";



export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="w-full bg-white shadow-md">
      {/* Desktop Navbar */}
      <div className="hidden lg:flex justify-between items-center px-6 lg:px-16 h-16">
        {/* Logo */}
        <h3 className="font-Montserrat font-semibold text-xl">Bandage</h3>

        {/* Menu Links */}
        <ul className="flex space-x-6 font-Montserrat text-sm text-gray-600">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/shop">Shop</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/pricing">Pricing</Link>
          </li>
        </ul>

        {/* Icons Section */}
        <div className="flex space-x-4 items-center text-[#252B42]">
          <FaSearch size={16} />
          <Link href="/cart" passHref>
            <FaShoppingCart
              size={16}
              className="cursor-pointer hover:text-gray-700"
            />
          </Link>
          <FaEnvelope size={16} />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
     {/* Mobile Navbar */}
<div className="lg:hidden flex justify-between items-center px-4 py-3">
  {/* Logo */}
  <h3 className="font-Montserrat font-semibold text-xl">Bandage</h3>

  {/* User Icon & Hamburger Menu */}
  <div className="flex items-center space-x-4">
    <SignedIn>
      <UserButton />
    </SignedIn>
    {/* Hamburger Menu */}
    <button onClick={toggleMenu} className="text-[#252B42] focus:outline-none">
      {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
    </button>
  </div>
</div>

{/* Mobile Menu Dropdown */}
{isMenuOpen && (
  <div className="bg-white text-black flex flex-col items-center py-4 space-y-4">
    <ul className="space-y-3 font-Montserrat text-lg font-bold text-black">
      {[
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Pricing", path: "/pricing" },
      ].map((item) => (
        <li key={item.name} className="hover:text-blue-500 transition duration-300">
          <Link href={item.path}>{item.name}</Link>
        </li>
      ))}
      <li className="hover:text-blue-500 transition duration-300">
        <Link href="/cart" className="flex items-center space-x-2">
          <FaShoppingCart className="w-6 h-6" />
          <span>Cart</span>
        </Link>
      </li>
      <li>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </li>
    </ul>
  </div>
)}
       {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="bg-white text-black flex flex-col items-center py-4 space-y-3">
          <ul className="space-y-2 font-Montserrat text-base text-black">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/cart" className="flex items-center space-x-2">
                <FaShoppingCart className="text-black w-5 h-5" />
             
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}