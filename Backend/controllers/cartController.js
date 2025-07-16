import userModel from "../models/userModel.js";

// Add items to cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        
        // Ensure cardData is initialized
        if (!userData.cardData) {
            userData.cardData = {};
        }
        
        const cardData = userData.cardData;
        const itemId = req.body.itemId;

        if (!cardData[itemId]) {
            cardData[itemId] = 1;
        } else {
            cardData[itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cardData });
        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error adding to cart" });
    }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);

        // Ensure cardData is initialized
        if (!userData.cardData) {
            userData.cardData = {};
        }

        const cardData = userData.cardData;
        const itemId = req.body.itemId;

        if (cardData[itemId] && cardData[itemId] > 0) {
            cardData[itemId] -= 1;

            if (cardData[itemId] === 0) {
                delete cardData[itemId];
            }
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cardData });
        res.json({ success: true, message: "Removed from Cart" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error removing from cart" });
    }
};

// Fetch user's cart
const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);

        // Ensure cardData is initialized
        const cardData = userData.cardData || {};
        res.json({ success: true, cardData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching cart" });
    }
};

export { addToCart, removeFromCart, getCart };
