"use client";
import { useState, useEffect } from "react";
import { getCartItems } from "../actions/actions";
import { Products } from "@/types/products";
import { FaShoppingBag } from "react-icons/fa";
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
  //controls the button of checout page and fields and the order goes to sanity after checkout!
  const handlePlaceOrder = async () => {
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
    //returns types to sanity
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
    //creates the order to sanity or send the order to sanity in order schemas
    try {
      await client.create(orderData);
      localStorage.removeItem("appliedDiscount");

      // Success Alert
      Swal.fire({
        title: "Order Placed!",
        text: "Your order has been placed successfully.",
        icon: "success",
        position: "center",
        showConfirmButton: true,
        confirmButtonText: "Go to Home Page",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/"; // Redirect to homepage
        }
      });
    } catch (error) {
      console.error("Order Not Created! Try Again.", error);

      // Error Alert
      Swal.fire({
        title: "Error!",
        text: "Order could not be placed. Please try again.",
        icon: "error",
        position: "center",
        confirmButtonText: "Retry",
      });
    }
  };

  return (
    <div>
      <BlueHeader />
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Last Step: Fill in Your Details to Finalize Your Order
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-medium">First Name</label>
              <input
                id="firstName"
                value={formValues.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.firstName ? 'border-red-500' : ''}`}
              />
              {formErrors.firstName && <p className="text-red-500 text-sm">First name is required</p>}
            </div>
            <div>
              <label className="block text-lg font-medium">Last Name</label>
              <input
                id="lastName"
                value={formValues.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.lastName ? 'border-red-500' : ''}`}
              />
              {formErrors.lastName && <p className="text-red-500 text-sm">Last name is required</p>}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-lg font-medium">Address</label>
            <input
              id="address"
              value={formValues.address}
              onChange={handleInputChange}
              placeholder="Enter your address"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.address ? 'border-red-500' : ''}`}
            />
            {formErrors.address && <p className="text-red-500 text-sm">Address is required</p>}
          </div>
          <div className="mt-4">
            <label className="block text-lg font-medium">City</label>
            <input
              id="city"
              value={formValues.city}
              onChange={handleInputChange}
              placeholder="Enter your city"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.city ? 'border-red-500' : ''}`}
            />
            {formErrors.city && <p className="text-red-500 text-sm">City is required</p>}
          </div>
          <div className="mt-4">
            <label className="block text-lg font-medium">Zip Code</label>
            <input
              id="zipCode"
              value={formValues.zipCode}
              onChange={handleInputChange}
              placeholder="Enter your zip code"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.zipCode ? 'border-red-500' : ''}`}
            />
            {formErrors.zipCode && <p className="text-red-500 text-sm">Zip code is required</p>}
          </div>
          <div className="mt-4">
            <label className="block text-lg font-medium">Phone</label>
            <input
              id="phone"
              value={formValues.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.phone ? 'border-red-500' : ''}`}
            />
            {formErrors.phone && <p className="text-red-500 text-sm">Phone number is required</p>}
          </div>
          <div className="mt-4">
            <label className="block text-lg font-medium">Email</label>
            <input
              id="email"
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${formErrors.email ? 'border-red-500' : ''}`}
            />
            {formErrors.email && <p className="text-red-500 text-sm">Email is required</p>}
          </div>
          {/* Total Amount & Order Button */}
          <p className="text-center mt-4 text-green-600 font-semibold text-lg">
            Successfully Paid  ${subtotal}
          </p>
          <button
            onClick={handlePlaceOrder}
            className="w-full mt-6 bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Place Order <FaShoppingBag className="inline-block ml-2" />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
  
}