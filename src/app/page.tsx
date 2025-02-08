import BlueHeader from "./components/blue-header";
import Carausel from "./components/caraousel";
import Editors from "./components/editorspick";
import Footer from "./components/footer";
import GreenDiv from "./components/green-div";
import Lastdiv from "./components/lastdiv";
import Navbar from "./components/navbar";
import ProductCard from "./components/products-card";
import Whitediv from "./components/white-dic";
import greenman from "@/public/images/shop-hero-2-png-picture-1.png";

export default function Home(){
  return(
    <div>
      <BlueHeader/>
      <Navbar/>
      <Carausel/>
      <Editors/>
      <ProductCard/>
      <GreenDiv
        season="SUMMER 2020"
        title="Vita Classic Product"
        description="Discover the classic products designed for your summer needs."
        price="$16.48"
        buttonText="ADD TO CART"
        imageSrc={greenman}
      />
      <Whitediv/>
      <Lastdiv/> 
      <Footer/>
           
    </div>
  )
}