import { Products } from "@/types/products";

export const addToCart = (product: Products) => {
    let cart: Products[];

    try {
        cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!Array.isArray(cart)) {
            cart = [];
        }
    } catch (error) {
        console.error("Error parsing cart data from localStorage:", error);
        cart = [];
    }

    const existingProductIndex = cart.findIndex((item) => item._id === product._id);

    if (existingProductIndex > -1) {
        // Increase the quantity when the product is added again
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 0) + 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeFromCart = (productId: string) => {
    let cart: Products[];

    try {
        cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!Array.isArray(cart)) {
            cart = [];
        }
    } catch (error) {
        console.error("Error parsing cart data from localStorage:", error);
        cart = [];
    }

    cart = cart.filter((item) => item._id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const updateCartQuantity = (productId: string, quantity: number) => {
    let cart: Products[];

    try {
        cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!Array.isArray(cart)) {
            cart = [];
        }
    } catch (error) {
        console.error("Error parsing cart data from localStorage:", error);
        cart = [];
    }

    const productIndex = cart.findIndex((item) => item._id === productId);

    if (productIndex > -1) {
        cart[productIndex].quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
    }
};

export const getCartItems = (): Products[] => {
    let cart: Products[];

    try {
        cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!Array.isArray(cart)) {
            cart = [];
        }
    } catch (error) {
        console.error("Error parsing cart data from localStorage:", error);
        cart = [];
    }

    return cart;
};