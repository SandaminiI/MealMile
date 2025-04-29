import express from 'express';
import { addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    searchMenuItems,
    getAllMenu,
    ItemPhotoController,
    getSingleItem
 } from '../Controllers/menuController.js';
import { verifyToken,
    requireSignIn,
    isAdmin,
    isRestaurant
 } from '../middlewares/authmiddleware.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js'

const router = express.Router();

//create menu items using Id
router.post('/AddMenu',verifyToken,isRestaurant,uploadMiddleware, addMenuItem);

//update menu items using Id
router.put('/updateMenu/:MenuID',verifyToken,isRestaurant, updateMenuItem);

//delete menu items using Id
router.delete('/deleteMenu/:MenuID',verifyToken,isRestaurant, deleteMenuItem);

//search menu items
router.post('/SearchMenu',verifyToken,isRestaurant, searchMenuItems);

//get all items
router.get('/getAllMenu',getAllMenu);

//get photo
router.get("/getItemphoto/:pid",ItemPhotoController);

//get single item
router.get('/getItem',verifyToken ,getSingleItem);

export default router;