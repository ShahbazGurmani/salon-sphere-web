import Salon from "../models/createSalonModel.js";

// Function to add a salon with type specified in the request body
export const createSalonProfile = async (req, res) => {
  try {
    const {
      name,
      reviews,
      description,
      city,
      address,
      latitude,
      longitude,
      salonType,
      fillheart,
      about,
      stylists,
      services,
    } = req.body;

    // Validate required fields
    if (!name || !salonType || !services) {
      return res.status(400).json({
        message: "name, salonType, and services are required.",
      });
    }

    // Handle uploaded files (coverImage and galleryImages)
    const coverImage = req.files?.coverImage
      ? `/uploads/${req.files.coverImage[0].filename}`
      : null;

    const images = req.files?.images
      ? req.files.images.map((file) => `/uploads/${file.filename}`)
      : [];

    // Create a new salon document
    const newSalon = new Salon({
      name,
      reviews: reviews ? JSON.parse(reviews) : {}, // Parse reviews if sent as JSON
      description,
      coverImage,
      images,
      address,
      city,
      location: { latitude, longitude },
      salonType: Array.isArray(salonType) ? salonType : [salonType], // Ensure array
      fillheart: fillheart || false,
      about,
      stylists: stylists ? JSON.parse(stylists) : [], // Parse stylists JSON
      services: services ? JSON.parse(services) : [], // Parse services JSON
      user: req.user._id,
    });

    // Save the salon to the database
    await newSalon.save();

    // Return a success response
    res.status(201).json({
      message: "Salon added successfully",
      salon: newSalon,
    });
  } catch (error) {
    console.error("Error adding salon:", error);
    res.status(500).json({
      message: "Server error while adding salon",
      error,
    });
  }
};

// Route handler for getting salon data or profile
export const viewSalonProfile = async (req, resp) => {
  try {
    const id = req.params.id;
    const salonProfile = await Salon.findById(id);

    if (!salonProfile) {
      return resp.status(404).send({
        success: false,
        message: "Salon profile not found",
      });
    }

    resp.status(200).send({
      success: true,
      message: "Getting Data Successfully",
      salonProfile,
    });
  } catch (err) {
    console.log("Error in viewSalonProfile:", err);
    resp.status(500).send({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
