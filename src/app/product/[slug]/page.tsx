import React from "react";
import { client } from "@/src/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import BlueHeader from "../../components/blue-header";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ProductCard from "../../components/products-card";
import { groq } from "next-sanity";

// Defining the Product type
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPercent: number;
  sizes: string[];
  imageUrl: string;
  colors: string[];
  category: string;
}

interface ProductPageProps {
  params: Promise<{ slug: string }>; // Mark params as a Promise
}

async function getProduct(slug: string): Promise<Product | null> {
  const product = await client.fetch(
    groq`*[_type == "products" && slug.current == $slug][0]{
      _id,
      name,
      description,
      price,
      discountPercent,
      sizes,
      "imageUrl": image.asset->url,
      colors,
      category,
      "slugCurrent": slug.current
    }`,
    { slug }
  );

  return product || null;
}
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params; // Explicitly await params
  const post = await getProduct(slug)

  if (!post) {
    return (
      <div className="container mx-auto px-6 py-10 flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-800 mb-4">
            Product Not Found
          </p>
          <p className="text-xl text-gray-600 mb-6">
            Sorry, we could not find the product you were looking for.
          </p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-400 font-semibold text-lg"
          >
            Go back to the homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BlueHeader />
      <Navbar />

      <div className="container mx-auto px-6 py-10">
        {/* Product Details */}
        <div
          key={post._id}
          className="flex flex-col md:flex-row items-start gap-12 mb-12"
        >
          {/* Product Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src={post.imageUrl}
              alt={post.name}
              width={500} // Adjusted image size
              height={500}
              className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              {post.name}
            </h2>

            {/* Wishlist Icon placed directly below the heading */}
            <button className="text-xl text-gray-500 hover:text-red-600 mb-4">
              <FaHeart className="transform hover:scale-105 transition duration-300 ease-in-out" />
            </button>

            <p
              style={{
                fontSize: "1rem",
                color: "#6b7280",
                marginBottom: "1.5rem",
              }}
            >
              {post.description}
            </p>

            <div className=" flex whitespace-nowrap space-x-4 items-center">
              <p className="text-2xl font-semibold text-green-600 mb-2">
                {" "}
                Price: ${post.price}
              </p>
              <p className="text-sm text-red-500 mb-6">
                Discount: {post.discountPercent}%
              </p>
            </div>

            {/* Sizes Section */}
            <div className="mt-4 mb-6">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                Available Sizes:
              </h3>
              <div className="flex gap-4 flex-wrap">
                {post.sizes.map((size: string) => (
                  <span
                    key={size}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>

            {/* Colors Section */}
            {post.colors && post.colors.length > 0 && (
              <div className="mt-4 mb-6">
                <h3 className="text-sm font-medium text-gray-800 mb-2">
                  Available Colors:
                </h3>
                <div className="flex gap-4 flex-wrap">
                  {post.colors.map((color: string) => (
                    <span
                      key={color}
                      className="w-8 h-8 rounded-full"
                      style={{
                        backgroundColor: color,
                        border: "1px solid #ddd",
                      }}
                    ></span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex items-center gap-4 mt-6">
              <Link href="/shop">
                <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-400 transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2">
                  Add to cart from shop page <FaShoppingCart />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ProductCard />
      <Footer />
    </div>
  );
}