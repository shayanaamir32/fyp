import Offer from "../models/offer.js";
import mongoose from "mongoose";
import blockchainService from "./blockchain.js";

class OfferService {
  // Create a new offer
  async createOffer(data) {
    console.log(data);
    const offer = new Offer(data);
    const savedOffer = await offer.save();

    // Record to blockchain asynchronously (non-blocking)
    this.recordOfferToBlockchain(savedOffer).catch((err) => {
      console.log("Blockchain recording skipped:", err.message);
    });

    return savedOffer;
  }

  // Helper method to record offer to blockchain (non-blocking)
  async recordOfferToBlockchain(offer) {
    try {
      const result = await blockchainService.recordOfferToBlockchain(offer);

      if (result.success && result.blockchainRecord) {
        // Update offer with blockchain data
        await Offer.findByIdAndUpdate(offer._id, {
          blockchainHash: result.blockchainRecord.data,
          blockchainTransactionHash: result.blockchainRecord.transactionHash,
          blockchainStatus: "recorded",
          blockchainVerificationTime: new Date(),
        });

        console.log("✅ Offer blockchain data saved to database");
      }
    } catch (error) {
      console.log("⚠️  Blockchain recording completed with note:", error.message);
      // Silently fail - don't affect main functionality
    }
  }

  // Get all offers made by a specific user
  async getOffersByUser(userId) {
    return await Offer.find({ user: new mongoose.Types.ObjectId(userId) })
      .populate("vendor", "businessName") // optional: populate vendor info
      .sort({ createdAt: -1 });
  }

  // Get all offers received by a specific vendor
  async getOffersByVendor(vendorId) {
    return await Offer.find({ vendor: new mongoose.Types.ObjectId(vendorId) })
      .populate("user", "username") // optional: populate user info
      .sort({ createdAt: -1 });
  }

  // Get a single offer by its ID
  async getOfferById(offerId) {
    return await Offer.findById(offerId)
      .populate("user", "username")
      .populate("vendor", "businessName");
  }

  // Update the status of an offer (Pending, Accepted, Rejected)
  async updateOfferStatus(offerId, status) {
    const offer = await Offer.findById(offerId);
    const oldStatus = offer.status;

    const updatedOffer = await Offer.findByIdAndUpdate(
      offerId,
      { status },
      { new: true }
    );

    // Record status change to blockchain asynchronously (non-blocking)
    if (oldStatus !== status) {
      this.recordStatusChangeToBlockchain(
        offerId,
        oldStatus,
        status,
        updatedOffer
      ).catch((err) => {
        console.log("Blockchain status recording skipped:", err.message);
      });
    }

    return updatedOffer;
  }

  // Helper method to record status change to blockchain (non-blocking)
  async recordStatusChangeToBlockchain(offerId, oldStatus, newStatus, offer) {
    try {
      const result = await blockchainService.recordOfferStatusChange(
        offerId,
        oldStatus,
        newStatus,
        offer
      );

      if (result.success && result.blockchainRecord) {
        // Add to blockchain status history
        await Offer.findByIdAndUpdate(offerId, {
          $push: {
            blockchainStatusHistory: {
              status: newStatus,
              transactionHash: result.blockchainRecord.transactionHash,
              timestamp: new Date(),
            },
          },
          blockchainStatus: "recorded",
        });

        console.log("✅ Offer status change recorded to blockchain");
      }
    } catch (error) {
      console.log(
        "⚠️  Blockchain status recording completed with note:",
        error.message
      );
      // Silently fail - don't affect main functionality
    }
  }

  // Delete an offer
  async deleteOffer(offerId) {
    return await Offer.findByIdAndDelete(offerId);
  }
}

const offerService = new OfferService();
export default offerService;
