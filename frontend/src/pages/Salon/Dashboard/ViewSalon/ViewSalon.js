import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // For accessing dynamic route parameters
import SalonLayout from "../../../../components/SalonLayout/SalonLayout";
import ImageGallery from "react-image-gallery"; // Gallery library
import "react-image-gallery/styles/css/image-gallery.css";
import "./ViewSalon.css"; // Custom CSS for styling

const ViewSalon = () => {
  const { id } = useParams(); // Get the salon ID from the URL
  console.log(id);
  const [salonProfile, setSalonProfile] = useState(null);

  useEffect(() => {
    // Fetch the salon data on component load
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}api/salon/view-salon/${id}`
        );
        setSalonProfile(response.data.salonProfile);
      } catch (error) {
        console.error("Error fetching salon data:", error);
      }
    };

    fetchData();
  }, [id]); // Re-run the effect if the ID changes

  if (!salonProfile) {
    return <div>Loading...</div>;
  }

  // Preparing data for the image gallery
  const galleryImages = salonProfile.images.map((img) => ({
    original: `${process.env.REACT_APP_API}${img}`,
    thumbnail: `${process.env.REACT_APP_API}${img}`,
  }));

  return (
    <SalonLayout>
      <div className="salon-profile-container">
        <h1 className="salon-name">{salonProfile.name}</h1>

        {/* Cover Image */}
        <img
          src={`${process.env.REACT_APP_API}${salonProfile.coverImage}`}
          alt="Cover"
          className="cover-image"
        />

        {/* About Section */}
        <p className="salon-description">{salonProfile.description}</p>

        {/* Location and Address */}
        <div className="location-info">
          <p>
            <strong>Address:</strong> {salonProfile.address},{" "}
            {salonProfile.city}
          </p>
          <p>
            <strong>Coordinates:</strong> {salonProfile.location.latitude},{" "}
            {salonProfile.location.longitude}
          </p>
          <p>
            <strong>Salon Type:</strong> {salonProfile.salonType.join(", ")}
          </p>
        </div>

        {/* Gallery */}
        <div className="gallery-section">
          <h2>Gallery</h2>
          <ImageGallery items={galleryImages} />
        </div>

        {/* About */}
        <div className="about-section">
          <h2>About Us</h2>
          <p>{salonProfile.about}</p>
        </div>

        {/* Stylists */}
        <div className="stylists-section">
          <h2>Our Stylists</h2>
          {salonProfile.stylists.map((stylist) => (
            <div key={stylist._id} className="stylist-card">
              <h3>{stylist.name}</h3>
              <p>
                <strong>Experience:</strong> {stylist.experience} years
              </p>
              <p>
                <strong>Expertise:</strong> {stylist.expertise}
              </p>
              <p>
                <strong>About:</strong> {stylist.about}
              </p>
              <div className="time-slots">
                <h4>Available Slots</h4>
                {stylist.dateTimeSlots.map((slot) => (
                  <div key={slot._id}>
                    <p>
                      <strong>Date:</strong> {slot.date}
                    </p>
                    <p>
                      <strong>Times:</strong> {slot.times.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="services-section">
          <h2>Our Services</h2>
          {salonProfile.services.map((service) => (
            <div key={service._id} className="service-card">
              <h3>{service.type}</h3>
              {service.options.map((option) => (
                <p key={option._id}>
                  <strong>{option.name}:</strong> ${option.price}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </SalonLayout>
  );
};

export default ViewSalon;
