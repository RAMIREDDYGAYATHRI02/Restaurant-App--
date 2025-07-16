import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const [token, setToken] = useState("");
    const url = "https://restaurant-app-backend-hsx9.onrender.com";

    // Save cartItems to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
        }));

        if (token) {
            try {
                await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
            } catch (error) {
                console.error("Error adding item to cart:", error.response?.data?.message || error.message);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        if (cartItems[itemId] > 0) {
            setCartItems((prev) => ({
                ...prev,
                [itemId]: prev[itemId] - 1,
            }));

            if (token) {
                try {
                    await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
                } catch (error) {
                    console.error("Error removing item from cart:", error.response?.data?.message || error.message);
                }
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            setCartItems(response.data.cardData);
        } catch (error) {
            console.error("Error loading cart data:", error.message);
        }
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error.message);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();

            // Load cart items from localStorage
            const savedCartItems = localStorage.getItem("cartItems");
            if (savedCartItems) {
                setCartItems(JSON.parse(savedCartItems));
            }

            // Load token and cart data for logged-in users
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                try {
                    await loadCartData(storedToken);
                } catch (error) {
                    console.error("Error fetching cart:", error.message);
                }
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    };

    return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
