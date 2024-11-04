import express from "express";
import {
  isAdmin,
  isSalonOwner,
  requireSignIn,
  authenticateUser,
} from "../middlewares/authMiddlewares.js";
import salonPicsUpload from "../middlewares/imagesMiddleWare.js";
import {
  createSalonProfile,
  viewSalonProfile,
} from "../controllers/salonController.js";
const router = express.Router();
// Route to add a salon with images
router.post(
  "/create-salon-profile",
  salonPicsUpload,
  authenticateUser,
  createSalonProfile
);

//route for getting Salon  data
router.get("/view-salon/:id", viewSalonProfile);

export default router;
