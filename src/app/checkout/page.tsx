"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCartItems } from "../actions/actions";
import Link from "next/link";
import { Products } from "@/types/products";
import { urlFor } from "@/src/sanity/lib/image";
import { CgChevronRight } from "react-icons/cg";
import Navbar from "../components/navbar";
import BlueHeader from "../components/blue-header";
import Footer from "../components/footer";
import { client } from "@/src/sanity/lib/client";
import Swal from "sweetalert2";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<Products[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    address: false,
    city: false,
    zipCode: false,
    phone: false,
    email: false,
  });
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    setCartItems(getCartItems());
    const appliedDiscount = localStorage.getItem("appliedDiscount");
    if (appliedDiscount) {
      setDiscount(Number(appliedDiscount));
    }
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = Math.max(subtotal - discount, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const validateForm = () => {
    const errors = {
      firstName: !formValues.firstName,
      lastName: !formValues.lastName,
      address: !formValues.address,
      city: !formValues.city,
      zipCode: !formValues.zipCode,
      phone: !formValues.phone,
      email: !formValues.email,
    };
    setFormErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      Swal.fire({
        title: "Missing Fields!",
        text: "Please fill in all required fields before placing the order.",
        icon: "warning",
        position: "center",
        confirmButtonText: "OK",
      });
      return;
    }
  
    const lineItems = cartItems.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));
  
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems }),
      });
  
      const data = await response.json();
  
      if (data.url) {
        const stripeSessionId = data.id;
        window.location.href = data.url; // Redirect to Stripe Checkout
  
        // Polling function to check payment status
        const checkPayment = async () => {
          try {
            const paymentResponse = await fetch(`/api/payment-status?id=${stripeSessionId}`);
            const paymentData = await paymentResponse.json();
  
            if (paymentData.success) {
              // Save order in Sanity
              const orderData = {
                _type: "order",
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                address: formValues.address,
                city: formValues.city,
                zipCode: formValues.zipCode,
                phone: formValues.phone,
                email: formValues.email,
                cartItems: cartItems.map((item) => ({
                  _type: "reference",
                  _ref: item._id,
                })),
                total: total,
                discount: discount,
                orderDate: new Date().toISOString(),
              };
  
              await client.create(orderData);
              localStorage.removeItem("appliedDiscount");
              localStorage.removeItem("cartItems"); // Clear cart
              setCartItems([]); // Clear cart state
  
              Swal.fire({
                title: "Order Placed!",
                text: "Your order has been placed successfully.",
                icon: "success",
                position: "center",
                confirmButtonText: "OK",
                timer: 3000,
                showConfirmButton: false,
              });
            } else if (paymentData.pending) {
              // If payment is still pending, check again after 5 seconds
              setTimeout(checkPayment, 5000);
            } else {
              Swal.fire({
                title: "Payment Failed!",
                text: "Transaction was unsuccessful. Please try again.",
                icon: "error",
                position: "center",
                confirmButtonText: "Retry",
              });
            }
          } catch (error) {
            console.error("Error checking payment status:", error);
          }
        };
  
        setTimeout(checkPayment, 5000); // Start checking payment status
      } else {
        Swal.fire({
          title: "Error!",
          text: "Unable to initiate payment. Please try again.",
          icon: "error",
          position: "center",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };
  

  return (
    <div>
      <BlueHeader />
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-lg text-gray-700 mb-6">
          <Link href="/cart" className="hover:text-black transition">
            Cart
          </Link>
          <CgChevronRight className="w-5 h-5" />
          <span className="font-semibold">Checkout</span>
        </nav>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Order Summary */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            {/*Fecthing selected cart items from the cart into the order summary card */}
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 py-3 border-b"
                >
                  <div className="w-20 h-20 overflow-hidden rounded-lg">
                    {item.image && (
                      <Image
                        src={urlFor(item.image).url()}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-lg font-semibold">
                    ${item.price * item.quantity}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Your cart is empty.</p>
            )}
            <div className="text-left pt-6">
              <p className="text-lg mt-2">
                Subtotal: <span className="font-semibold">${subtotal}</span>
              </p>
              <p className="text-lg mt-2">
                Discount: <span className="font-semibold">-${discount}</span>
              </p>
              <p className="text-xl font-bold mt-3">
                Total: ${total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Billing Form connected to sanity*/}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-lg font-medium capitalize"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-500">
                    First name is required.
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-lg font-medium capitalize"
                >
                  Last Name{" "}
                </label>
                <input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.lastName && (
                  <p className="text-sm text-red-500">Last name is required.</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-lg font-medium capitalize"
              >
                Address{" "}
              </label>
              <input
                id="address"
                placeholder="Enter your address"
                value={formValues.address}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {formErrors.address && (
                <p className="text-sm text-red-500">Address is required.</p>
              )}
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-lg font-medium capitalize"
              >
                City
              </label>
              <input
                id="city"
                placeholder="Enter your city"
                value={formValues.city}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {formErrors.city && (
                <p className="text-sm text-red-500">City is required.</p>
              )}
            </div>
            <div>
              <label
                htmlFor="zipCode"
                className="block text-lg font-medium capitalize"
              >
                Zip Code
              </label>
              <input
                id="zipCode"
                placeholder="Enter your zip code"
                value={formValues.zipCode}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {formErrors.zipCode && (
                <p className="text-sm text-red-500">Zip Code is required.</p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-lg font-medium capitalize"
              >
                Phone
              </label>
              <input
                id="phone"
                placeholder="Enter your phone number"
                value={formValues.phone}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {formErrors.phone && (
                <p className="text-sm text-red-500">Phone is required.</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium capitalize"
              >
                Email
              </label>
              <input
                id="email"
                placeholder="Enter your email address"
                value={formValues.email}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">Email is required.</p>
              )}
            </div>
            {/* Checkout Button */}
            {/* <button
              onClick={handleStripeCheckout}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-green-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-green-700 transition"
            >
              Pay Now
            </button> */}
            <button
              onClick={handleCheckout}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Pay ${total.toFixed(2)} now!
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}