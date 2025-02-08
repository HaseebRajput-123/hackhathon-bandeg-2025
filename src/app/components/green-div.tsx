import Image, { StaticImageData } from "next/image";

interface GreenDivProps {
  season?: string;
  title?: string;
  description?: string;
  price?: string;
  buttonText?: string;
  imageSrc: StaticImageData;
}

export default function GreenDiv({
  season = "SUMMER 2020",
  title = "Vita Classic Product",
  description = "We know how large objects will act, We know how are objects will act, We know",
  price = "$16.48",
  buttonText = "ADD TO CART",
  imageSrc,
}: GreenDivProps) {
  return (
    <div className="w-full relative bg-[#23856D] rounded-[5px] py-10 lg:py-20 px-5 flex justify-center mb-8">
      <div className="w-[90%] max-w-[1200px] flex flex-col lg:flex-row gap-10 items-center">
        {/* Text Section */}
        <div className="lg:w-1/2 flex flex-col gap-4 text-center lg:text-left">
          <h4 className="font-Montserrat font-normal text-lg text-white">
            {season}
          </h4>
          <h1 className="font-Montserrat font-bold text-2xl lg:text-5xl leading-tight text-white">
            {title}
          </h1>
          <p className="font-Montserrat font-medium text-sm lg:text-base leading-relaxed text-white">
            {description}
          </p>
          <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-start">
            <h3 className="font-Montserrat font-bold text-2xl text-white">
              {price}
            </h3>
            <button className="rounded-md bg-[#2DC071] py-3 px-6 hover:bg-[#249d5e] transition-all">
              <span className="font-Montserrat text-sm text-white">
                {buttonText}
              </span>
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-[80%] lg:w-[400px]">
            <Image
              src={imageSrc}
              alt="Green Div Image"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}