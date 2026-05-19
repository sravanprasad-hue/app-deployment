import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Layers, CreditCard, Presentation, Plus } from "lucide-react";
import axios from "axios";
import "./Starred.css";
import DashboardSidebar from "../DashboardLayout/DashboardSidebar"

//icons
import frame1 from "../../../assets/Frames/frame1.png";
import frame2 from "../../../assets/Frames/frame2.png";
import frame3 from "../../../assets/Frames/frame3.png";

import templates1 from "../../../assets/Starred-page-image/templates1.png";
import templates2 from "../../../assets/Starred-page-image/templates2.png";
import templates3 from "../../../assets/Starred-page-image/templates3.png";
import templates4 from "../../../assets/Starred-page-image/templates4.png";
import templates5 from "../../../assets/Starred-page-image/templates5.png";
import photos1 from "../../../assets/Starred-page-image/Photos1.png";
import photos2 from "../../../assets/Starred-page-image/Photos2.png";
import photos3 from "../../../assets/Starred-page-image/Photos3.png";
import photos4 from "../../../assets/Starred-page-image/Photos4.png";
import photos5 from "../../../assets/Starred-page-image/Photos5.png";
import photos6 from "../../../assets/Starred-page-image/Photos6.png";
import graphics1 from "../../../assets/Starred-page-image/Graphics1.png";
import graphics2 from "../../../assets/Starred-page-image/Graphics2.png";
import graphics3 from "../../../assets/Starred-page-image/Graphics3.png";
import graphics4 from "../../../assets/Starred-page-image/Graphics4.png";
import graphics5 from "../../../assets/Starred-page-image/Graphics5.png";

function Starred({
  showProjectSearch,
  setShowProjectSearch,
  handleClick,
  clickedBtn,
}) {
  // ✅ CHANGED: useState instead of static arrays
  // const [templates, setTemplates] = useState([]);
  // const [photos, setPhotos] = useState([]);
  // const [graphics, setGraphics] = useState([]);


    const templates = [
    { id: 1, img: templates1 },
    { id: 2, img: templates2 },
    { id: 3, img: templates3 },
    { id: 4, img: templates4 },
    { id: 5, img: templates4 },
 
  ];
  const photos = [
    { id: 1, img: photos1 },
    { id: 2, img: photos2 },
    { id: 3, img: photos3 },
    { id: 4, img: photos4 },
    { id: 5, img: photos5 },
     { id: 6, img: photos5 },
 
 
  ];
  const graphics = [
    { id: 1, img: graphics1 },
    { id: 2, img: graphics2 },
    { id: 3, img: graphics3 },
    { id: 4, img: graphics4 },
    { id: 5, img: graphics5 },
  ];

  // ✅ Get logged user
  // const user = JSON.parse(localStorage.getItem("user"));
  // const userId = user?.id;

  // ✅ API integration
  // useEffect(() => {
  //   const fetchStarred = async () => {
  //     try {
  //       const res = await axios.get(
  //         `/api/starred/${userId}`,
  //       );

  //       const data = res.data;

  //       // map to your existing structure
  //       setTemplates(
  //         data
  //           .filter((i) => i.item_type === "template")
  //           .map((i) => ({
  //             id: i.id,
  //             img: i.img || templates1, // fallback
  //           })),
  //       );

  //       setPhotos(
  //         data
  //           .filter((i) => i.item_type === "photo")
  //           .map((i) => ({
  //             id: i.id,
  //             img: i.img || photos1,
  //           })),
  //       );

  //       setGraphics(
  //         data
  //           .filter((i) => i.item_type === "graphic")
  //           .map((i) => ({
  //             id: i.id,
  //             img: i.img || graphics1,
  //           })),
  //       );
  //     } catch (err) {
  //       console.error("Starred fetch error:", err);
  //     }
  //   };

  //   if (userId) fetchStarred();
  // }, [userId]);

  return (
    <>
    <div className="dashboard">
      <div className="dashboard-body">
        <DashboardSidebar />

        <div className="dashboard-wrapper">

      <div className="starred-page">
        <div className="background-frame">
          <h1 className="starred-page-title">
            Starred <span>Collection</span>
          </h1>

          {/* Floating Images */}
          <img src={frame1} className="background-img img-left" />
          <img src={frame2} className="bacground-img img-right-top" />
          <img src={frame3} className="background-img img-right-bottom" />

          {/* Search */}
          <div
            className={`starred-search ${showProjectSearch ? "active" : ""}`}
          >
            <div
              className="starred-search-box"
              onClick={() => setShowProjectSearch(true)}
            >
              <FiSearch className="starred-search-icon" />

              <input
                type="text"
                placeholder="Search templates, photos or front style..."
                onFocus={() => setShowProjectSearch(true)}
                onBlur={() => setShowProjectSearch(false)}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="starred-row">
          <div className="starred-Header-T">
            <h3>Templates</h3>
            <span>See all</span>
          </div>

          <div className="starred-templates">
            {templates.map((t) => (
              <div key={t.id} className="starred-card-templates">
                <img src={t.img} alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="starred-row">
          <div className="starred-Header-T">
            <h3>Photos</h3>
            <span>See all</span>
          </div>

          <div className="starred-photos">
            {photos.map((t) => (
              <div key={t.id} className="starred-card-photos">
                <img src={t.img} alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* Graphics */}
        <div className="starred-row">
          <div className="starred-Header-T">
            <h3>Graphics</h3>
            <span>See all</span>
          </div>

          <div className="starred-graphics">
            {graphics.map((t) => (
              <div key={t.id} className="starred-card-graphics">
                <img src={t.img} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>
      
    </>
  );
}

export default Starred;
