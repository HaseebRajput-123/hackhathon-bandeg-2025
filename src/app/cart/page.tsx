"use client";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { urlFor } from '@/src/sanity/lib/image';
import BlueHeader from '../components/blue-header';
import Navbar from '../components/navbar';
import { useRouter } from 'next/navigation';
import { Products } from '@/types/products';
import { getCartItems } from '../actions/actions';



export default function CartPage() {
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    setProducts(getCartItems());
  }, []);

  const updateLocalStorage = (updatedCart: Products[]) => {
    localStorage.setItem('cart', JSON.stringify(Object.fromEntries(updatedCart.map((p) => [p.name, p]))));
  };
  const handleIncrease = (productName: string) => {
    setProducts((prevProducts) => {
        const updatedCart = prevProducts.map((product) => 
            product.name === productName ? { ...product, quantity: product.quantity + 1 } : product
        );

        // Save updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
    });
}; 

const handleDecrease = (productName: string) => {
  setProducts((prevProducts) => {
      const updatedCart = prevProducts.map((product) => 
          product.name === productName && product.quantity > 1
              ? { ...product, quantity: product.quantity - 1 }
              : product
      );

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
  });
};

  const handleRemove = (name: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = products.filter((product) => product.name !== name);
        setProducts(updatedCart);
        updateLocalStorage(updatedCart);
        Swal.fire('Removed!', 'Item has been removed from your cart.', 'success');
      }
    });
  };
 const router = useRouter();
  const handleCheckout = () => {
    Swal.fire({
      title: 'Proceed to Checkout?',
      text: "Make sure your cart is ready before proceeding!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Redirecting to checkout...', '', 'success');
         // Clear the cart after proceeding 
         router.push('/checkout');
         setProducts([]);
      }
    });
  };

  const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const discount = total * 0; // 0% discount
  const deliveryFee = 15;
  const finalTotal = total - discount + deliveryFee;

  return (
    <div>
      <BlueHeader />
      <Navbar />
      <div className="flex flex-col p-4 md:p-6 bg-gray-50 min-h-screen justify-center items-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Your Cart</h1>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center text-gray-500 mb-4 text-lg">Your cart is empty!</p>
            <a 
              href="/shop" 
              className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition-all duration-200"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {products.map((product) => (
              <div key={product._id} className="flex flex-col md:flex-row items-center justify-between bg-white p-4 shadow rounded-lg">
                <div className="flex items-center space-x-4">
                  <Image
                    src={product.image ? urlFor(product.image).url() : ''}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded"
                  />
                  <div className="text-center md:text-left">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-gray-600">Price: ${product.price}</p>
                    <p className="text-gray-600">Quantity: {product.quantity}</p>
                  </div>
                </div>
             {/* counter */}
                <div className="flex items-center space-x-2 mt-8 mr-7 ml-7 md:mt-0">
                  <button
                    onClick={() => handleDecrease(product.name)}
                    className="bg-gray-200 text-gray-600 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="font-semibold text-gray-700">{product.quantity}</span>
                  <button
                    onClick={() => handleIncrease(product.name)}
                    className="bg-gray-200 text-gray-600 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(product.name)}
                  className="text-red-500 hover:text-red-700 font-semibold mt-4 md:mt-0"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="bg-white p-4 shadow rounded-lg space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount (0%)</span>
                <span className="font-semibold text-red-500">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="bg-black text-white font-bold py-3 rounded-lg w-full hover:bg-gray-800"
            >
              Go to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}