import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//protected routes token base
export const requireSignIn = async (req , res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        console.log(error);
        res.status(404).send({
            success: false,
            message: 'Error on token'
        })
        res.send({error});
    }
}

/** ======================================================================================== */

//token verification part

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        // console.log(token);

        //check token is available or not. token is not available mean user not login
        if(!token){
            return res.status(404).send({
                success:false,
                message:'Access Denied, You have to log in first'
            });
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        //attach user data to request object
        req.user = await userModel.findById(decoded.id).select("-password");

        next();
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message: "Authontication Faild"
        })
    }
}

/** ======================================================================================== */

//check admin access
export const isAdmin = async (req,res,next) => {
    try {
        console.log(req.user);
        const user = await userModel.findById(req.user.id);
        console.log(user);
        if(user.role !==1 ){
            return res.status(404).send({
                success:false,
                message: 'Unauthorized Access'
            });
        }else{
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            error,
            message:'Error in admin middleware'
        })
    }
}

/** ======================================================================================== */

//check admin access
export const isRestaurant = async (req,res,next) => {
    try {
        console.log('req.user')
        console.log(req.user);
        const user = await userModel.findById(req.user.id);
        console.log(user);
        if(user.role !== 2 ){
            return res.status(404).send({
                success:false,
                message: 'Unauthorized Access'
            });
        }else{
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            error,
            message:'Error in resturant middleware'
        })
    }
}