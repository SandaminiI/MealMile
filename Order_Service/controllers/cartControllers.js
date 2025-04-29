const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");

// @desc Add item to cart
// @route POST /api/cart
const addItem = asyncHandler(async(req,res) => {
    const {customerId, restaurantId, item} = req.body;

    if(!customerId || !restaurantId || !item) {
        res.status(400);
        throw new Error("customerId, restaurantId and item are required");
    }

    // find if a cart already exists for this customer + restaurant
    let cart = await Cart.findOne({customerId, restaurantId});

    if(!cart) {
        // No cart found, then create new cart
        cart = new Cart({
            customerId,
            restaurantId,
            items: [item],
            totalAmount: item.quantity * (item.price || 0),
        });
    } else {
        // cart found, then add or update item
        const existingItem  = cart.items.find(i => i.itemId === item.itemId);

        if(existingItem) {
            // item already exists, then update quantity
            existingItem.quantity += item.quantity;
        } else {
            // new item, then push to items array
            cart.items.push(item);
        }

        // recalculate total amount
        cart.totalAmount = cart.items.reduce(
            (sum, i) => sum + i.quantity * (i.price || 0),
            0
        );
    }

    await cart.save();

    res.status(200).json({
        message: "Item added to cart successfully",
        cart
    });
});

// @desc View all carts
// @route GET /api/cart
const getCarts = asyncHandler(async(req,res) => {
    const { cid } = req.params;

    if(!cid) {
        res.status(400);
        throw new Error("CustomerId is required");
    }

    const carts = await Cart.find({ customerId: cid });

    if(!carts || carts.length === 0) {
        return res.status(404).json({message: "No carts found"});
    }

    res.status(200).json(carts);
});

// @desc View cart by restaurant
// @route GET /api/cart/:cid/:rid
const getCart = asyncHandler(async(req,res) => {
    const {cid, rid} = req.params;

    if(!cid || !rid) {
        res.status(400);
        throw new Error("CustomerId and RestaurantId are required");
    }

    const cart = await Cart.findOne({customerId: cid, restaurantId: rid});

    if(!cart) {
        return res.status(404).json({message: "Cart not found"});
    }

    res.status(200).json(cart);
});

// @desc Update cart(restaurant)
// @route PUT /api/cart/:cid/:rid
const updateCart = asyncHandler(async(req,res) => {
    const {cid, rid} = req.params;
    const {items} = req.body;

    if(!cid || !rid) {
        res.status(400);
        throw new Error("CustomerId and RestaurantId are required");
    }

    if(!items || !Array.isArray(items)){
        res.status(400);
        throw new Error("Items array is required");
    }

    const cart = await Cart.findOne({customerId: cid, restaurantId: rid});

    if(!cart){
        return res.status(404).json({message: "Cart not found"});
    }

    items.forEach(updatedItem => {
        const itemInCart = cart.items.find(i => i.itemId === updatedItem.itemId);
        if(itemInCart){
            itemInCart.quantity = updatedItem.quantity;
        }
    });

    cart.totalAmount = cart.items.reduce(
        (sum, i) => sum + i.quantity * (i.price || 0),
        0
    );

    await cart.save();

    res.status(200).json({
        message: "Cart updated successfully",
        cart
    });
});

// @desc Clear a restaurant's cart
// @route DELETE /api/cart/:cid/:rid
const clearCart = asyncHandler(async(req,res) => {
    const {cid, rid} = req.params;

    if(!cid || !rid){
        res.status(400);
        throw new Error("CustomerId and RestaurantId are required");
    }

    const cart = await Cart.findOne({customerId: cid, restaurantId: rid});

    if(!cart){
        return res.status(404).json({message:"Cart not found"});
    }

    await cart.deleteOne();

    res.status(200).json({message: "Cart deleted Successfully"});
});

// @desc Remove item from cart
// @route DELETE /api/cart/:rid/:iid
const removeItem = asyncHandler(async(req,res) => {
    const {cid, rid, iid} = req.params;

    if(!cid || !rid || !iid){
        res.status(400);
        throw new Error("CustomerId, RestaurantId, and ItemId are required");
    }

    const cart = await Cart.findOne({customerId: cid, restaurantId: rid});

    if(!cart){
        return res.status(404).json({message: "Cart not found"});
    }

    const filteredItems = cart.items.filter(item => item.itemId !== iid);

    if(filteredItems.length === cart.items.length){
        return res.status(404).json({message: "Item not found in the cart"});
    }

    cart.items = filteredItems;

    cart.totalAmount = cart.items.reduce(
        (sum, i) => sum + i.quantity * (i.price || 0),
        0
    );

    await cart.save();

    res.status(200).json({
        message: "Item removed successfully",
        cart
    });
});

// @desc Edit quantity of an item in cart
// @route PUT /api/cart/:cid/:rid/:iid
const editQuantity = asyncHandler(async (req, res) => {
    const { cid, rid, iid } = req.params;
    const { quantity } = req.body;

    if (!cid || !rid || !iid) {
        res.status(400);
        throw new Error("CustomerId, RestaurantId, and ItemId are required");
    }

    if (typeof quantity !== "number" || quantity < 1) {
        res.status(400);
        throw new Error("Valid quantity is required (minimum 1)");
    }

    const cart = await Cart.findOne({ customerId: cid, restaurantId: rid });

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(i => i.itemId === iid);

    if (!item) {
        return res.status(404).json({ message: "Item not found in the cart" });
    }

    item.quantity = quantity;

    cart.totalAmount = cart.items.reduce(
        (sum, i) => sum + i.quantity * (i.price || 0),
        0
    );

    await cart.save();

    res.status(200).json({
        message: "Item quantity updated successfully",
        cart
    });
});



module.exports = {
    addItem,
    getCarts,
    getCart,
    updateCart,
    removeItem,
    clearCart,
    editQuantity
};