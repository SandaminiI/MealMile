import menuModel from "../models/menuModel.js";
import fs from 'fs';

// Add new menu item
export const addMenuItem = async (req, res) => {
    try {

        // console.log('awa')
        const { name, description, price, category, tags, isAvailable } = req.body;
        const { image } = req.files;

        const restaurantId = req.user.id;

        const newItem = new menuModel({
            restaurantId,
            name,
            description,
            price,
            category,
            tags: tags.split(','),
            isAvailable
        });

        if (image && image.data && image.mimetype) {
            newItem.image.data = image.data;
            newItem.image.contentType = image.mimetype;
        }

        const savedItem = await newItem.save();
        console.log('Menu item added:', savedItem);

        res.status(200).send({ 
            success: true,
            message: 'New menu item added successfully.', 
            data: savedItem 
        });
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).send({
            success: false,
            message: 'Error adding new menu item.',
            error: error.message || error // Send back the actual error message
        });
    }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurantId = req.user._id;

        const updatedItem = await menuModel.findOneAndUpdate(
            { _id: id, restaurantId },
            req.body,
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).send({ success: false, message: "Menu item not found or unauthorized" });
        }

        res.status(200).send({ success: true, data: updatedItem });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurantId = req.user._id;

        const deletedItem = await menuModel.findOneAndDelete({ _id: id, restaurantId });

        if (!deletedItem) {
            return res.status(404).send({ success: false, message: "Menu item not found or unauthorized" });
        }

        res.status(200).send({ success: true, message: "Menu item deleted successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

// Search menu items (by name or tags)
export const searchMenuItems = async (req, res) => {
    try {
        const { keyword } = req.query;

        const items = await menuModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { tags: { $regex: keyword, $options: "i" } }
            ]
        });

        res.status(200).send({ success: true, data: items });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};


// get all menu items
export const getAllMenu = async (req,res) => {
    try {
        const MenuItems = await menuModel.find({}).select("-image").limit(12).sort({createdAt: -1});

        res.status(200).send({
            success:true,
            MenuItems            
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message: 'Error fetching Menu Items'
        })
    }
}

// Get Item photo controller
export const ItemPhotoController = async(req,res) => {
    try {
        const item = await menuModel.findById(req.params.pid).select("image");
        if(item.image.data){
            res.set("Content-type",item.image.contentType);
            return res.status(200).send(item.image.data);
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting photo",
            error,
        });
        
    }
};

//get single item
export const getSingleItem = async (req, res) => {
    try {
        const id = req.body._id;
        const item = await menuModel.findById({id});
        req.status(200).send({
            success:true,
            message:' Items getting successfull.',
            item
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message:'Error getting single item.'
        })
    }
}

