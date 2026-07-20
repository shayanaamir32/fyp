import express from "express";
import { offerController } from "../controllers/Offer.js"; // <-- make sure ".js" if using ES modules

const router = express.Router();

// Create/send a new offer
router.post("/send-offer", offerController.create);
router.get("/user/:userId", offerController.getByUser);
router.get("/vendor/:vendorId", offerController.getByVendor);
router.get("/:offerId", offerController.getById);
router.patch("/:offerId/status", offerController.updateStatus);
router.delete("/:offerId", offerController.delete);

export default router;
