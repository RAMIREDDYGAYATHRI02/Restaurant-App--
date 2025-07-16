import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized. Login Again." });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure req.body exists
        req.body = req.body || {};

        // Assign userId from the decoded token
        req.body.userId = token_decode.id;

        next(); // Proceed to the next middleware or route
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        res.json({ success: false, message: "Error during authentication" });
    }
};

export default authMiddleware;
