import { FaPhoneAlt, FaEnvelope, FaInstagram, FaYoutube, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function GreenHeader() {
  return (
    <div className="lg:block hidden w-full h-[58px] bg-[#23856D]">
      <div className="flex justify-between items-center w-full h-full px-[24px]">
        {/* Left section: Contact Info */}
        <div className="flex gap-[10px]">
          <button className="flex items-center gap-[5px] p-[10px] text-white">
            <FaPhoneAlt className="w-4 h-4" />
            <span className="font-Montserrat font-semibold text-[14px]">
              (225) 555-0118
            </span>
          </button>
          <button className="flex items-center gap-[5px] p-[10px] text-white rounded-[5px]">
            <FaEnvelope className="w-4 h-4" />
            <span className="font-Montserrat text-[14px]">
              haseebrajput059@gmail.com
            </span>
          </button>
        </div>

        {/* Center section: Follow Us */}
        <h6 className="font-Montserrat font-semibold text-[14px] text-white">
          Follow Us and get a chance to win 80% off
        </h6>

        {/* Right section: Social Icons */}
        <div className="flex gap-[10px] items-center">
          <h6 className="font-Montserrat text-[14px] text-white">Follow Us:</h6>
          <div className="flex gap-[10px]">
            <FaInstagram className="w-4 h-4 text-white cursor-pointer" />
            <FaYoutube className="w-4 h-4 text-white cursor-pointer" />
            <FaFacebookF className="w-4 h-4 text-white cursor-pointer" />
            <FaTwitter className="w-4 h-4 text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}