"use client";
import { client } from "@/src/sanity/lib/client";
import { urlFor } from "@/src/sanity/lib/image";
import { allProducts } from "@/src/sanity/lib/queries";
import { Products } from "@/types/products";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { addToCart } from "../actions/actions";

const ProductCard = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products: Products[] = await client.fetch(allProducts);
        setProducts(products.slice(0, 8)); // Limit to 6 products

      } catch (error) {
        console.log("Failed to load products. Please try again later", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);
  //ADD TO CART AND NOTIFICATION Handle
  const handleClick = (e: React.MouseEvent, product: Products) => {
    e.preventDefault();
    
      // Show SweetAlert2 notification after adding the product to the cart
      Swal.fire({
        title: 'Success!',
        text: `${product.name} has been added to your cart.`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'View Cart',
      }).then((result) => {
        if (result.isConfirmed) {
          // User clicked "OK"
          console.log('User clicked OK');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // User clicked "View Cart"
          window.location.href = '/cart';
        }
      });
    addToCart(product);
    console.log(product);
    
    }
  

  return (
    <div className="bg-gray-50 p-6">
      {/* Text Section */}
      <div className="w-full flex flex-col gap-4 justify-center items-center text-center mb-10">
        <h4 className="font-Montserrat font-normal text-[20px] leading-[30px] text-[#737373]">
          Featured Products
        </h4>
        <h3 className="font-Montserrat font-bold text-[24px] leading-[32px] text-[#252B42]">
          BESTSELLER PRODUCTS
        </h3>
        <p className="font-Montserrat font-normal text-[14px] leading-[20px] text-[#737373]">
          Problems trying to resolve the conflict between
        </p>
      </div>

      {/* Conditional Rendering */}
      {isLoading ? (
        <div className="text-center text-gray-600">
          Loading products please wait...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transform transition duration-300 hover:scale-105"
            >
              <div className="relative w-full h-56">
                {product.image && (
                  <Image
                    src={urlFor(product.image).url()}
                    alt={product.name}
                    priority={true}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                  />
                )}
              </div>
              <div className="p-4 text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-800 truncate">
                  {product.name}
                </h2>
                <p className="text-green-600 text-lg font-bold">
                  ${product.price}
                </p>
                {product.discountPercent > 0 && (
                  <p className="text-red-500 text-sm font-semibold">
                    {product.discountPercent}% Off
                  </p>
                )}
                <Link href={`/product/${product.slugCurrent}`}>
                  <button className="mt-4 bg-black text-white text-sm font-medium py-2 px-4 rounded hover:bg-gray-800">
                    View Product
                  </button>
                </Link>
                <button
                 onClick={(e) => handleClick(e, product)}
                  className="mt-4 bg-black text-white text-sm py-2 font-medium px-4 ml-5 rounded hover:bg-gray-800"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCard;