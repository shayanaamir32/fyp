import offer from "../models/offer.js";
import VendorModel from "../models/vendor.js";

export const vendorService = {
  async getAllVendors() {
    try {
      const vendors = await VendorModel.find();

      // Map over each vendor to calculate review count and average rating
      const vendorsWithReviews = vendors.map((vendor) => {
        const reviewCount = vendor.ratings?.length ?? 0; // Count of reviews
        const averageRating = reviewCount
          ? vendor.ratings.reduce((acc, rating) => acc + rating, 0) /
            reviewCount
          : 0; // Calculate average rating (0 if no ratings)

        return {
          ...vendor.toObject(), // Spread vendor data
          reviewCount, // Add review count
          averageRating, // Add average rating
        };
      });

      return vendorsWithReviews;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  },
  async getVendorById(vendorId) {
    try {
      const vendor = await VendorModel.findById(vendorId);

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      const reviewCount = vendor.ratings?.length ?? 0;
      const averageRating = reviewCount
        ? vendor.ratings.reduce((acc, rating) => acc + rating, 0) / reviewCount
        : 0;

      return {
        ...vendor.toObject(),
        reviewCount,
        averageRating,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong while fetching vendor");
    }
  },

  async getVendorDashboardStats(vendorId) {
    try {
      const offers = await offer.find({ vendor: vendorId });

      const stats = {
        totalEarnings: 0,
        completedEvents: 0,
        upcomingEvents: 0,
        pendingOffers: 0,
        acceptedOffers: 0,
        totalOffers: offers.length,
      };

      for (const offer of offers) {
        switch (offer.status) {
          case "Completed":
            stats.completedEvents += 1;
            stats.totalEarnings += offer.budget;
            break;
          case "Working":
            stats.upcomingEvents += 1;
            break;
          case "Pending":
            stats.pendingOffers += 1;
            break;
          case "Accepted":
            stats.acceptedOffers += 1;
            break;
        }
      }

      return stats;
    } catch (error) {
      console.error("Failed to fetch vendor dashboard stats:", error);
      throw new Error("Could not fetch dashboard data");
    }
  },

  async updateVendorImage(vendorId, imageUrl) {
    try {
      const updatedVendor = await VendorModel.findByIdAndUpdate(
        vendorId,
        { imageUrl },
        { new: true }
      );

      if (!updatedVendor) {
        throw new Error("Vendor not found");
      }

      return updatedVendor;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update vendor image");
    }
  },

  async updateVendorSpecialties(vendorId, specialties) {
    try {
      const updatedVendor = await VendorModel.findByIdAndUpdate(
        vendorId,
        { specialties },
        { new: true }
      );

      if (!updatedVendor) {
        throw new Error("Vendor not found");
      }

      return updatedVendor;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update vendor specialties");
    }
  },
};
