import React, { useState, useRef, useEffect } from "react";
import search from "../../../assets/search.svg";
import back_arrow from "../../../assets/Create-Design/back_arrow.svg";
import move_arrow from "../../../assets/Create-Design/move_arrow.svg";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import presentation from "../../../assets/Create-Design/presentation.png";

import design1 from "../../../assets/Create-Design/Design-template1.png";
import design2 from "../../../assets/Create-Design/Design-template2.png";
import design3 from "../../../assets/Create-Design/Design-template3.png";
import design4 from "../../../assets/Create-Design/Design-template4.png";

export default function Presentation() {
  const scrollRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();

  const sizes = [
    { title: "Presentation", dimensions: "1920x1080 px", label: "72 PPI", frame: presentation },
  ];

  const templates = [
    { img: design1, title: "HR Presentation", dimensions: "1920x1080 px" },
    { img: design2, title: "Recruitment Presentation", dimensions: "1920x1080 px" },
    { img: design3, title: "Finance Presentation", dimensions: "1920x1080 px" },
    { img: design4, title: "Modern Company Presentation", dimensions: "1920x1080 px" },
    { img: design1, title: "HR Presentation", dimensions: "1920x1080 px" },
    { img: design2, title: "Recruitment Presentation", dimensions: "1920x1080 px" },
    { img: design3, title: "Finance Presentation", dimensions: "1920x1080 px" },
    { img: design4, title: "Modern Company Presentation", dimensions: "1920x1080 px" },
  ];


  // SCROLL LOGIC (same as poster)
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);


const filteredTemplates = templates.filter((item) =>
  item.title
    .toLowerCase()
    .includes(searchTerm.trim().toLowerCase())
);

const handleTemplateClick = async (template) => {
  try {
    const res = await axios.post(
      "/api/designs",
      {
        name: template.title,
        template_id: template.id || null,
        width: 1920,
        height: 1080,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    navigate(`/editor/${res.data.projectId}`);
  } catch (error) {
    console.error(error);
    alert("Failed to create design");
  }
};

  return (
    <div className="tab-inner">

      {/* HEADER */}
      <div className="poster-header-container">
        <div className="poster-search-wrapper">
          <img src={search} className="poster-search-icon" />
          <input
            type="text"
            placeholder="Search templates"
            className="poster-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="poster-content-container">

        {/* SIZE SECTION */}
        <div className="pop">

          <div className="poster-card-container">
            <div className="pop-title">
              <h4>Presentations</h4>
            </div>

            {/* SCROLL ROW */}
            <div className="card-row" ref={scrollRef}>
              {sizes.map((item, index) => (
                <div key={index} className="size-card">

                  <div className="card-header">
                    <p>{item.title}</p>
                  </div>

                  <div className="card-frame">
                    <img src={item.frame} />
                  </div>

                  <div className="card-footer">
                    <span className="dimension">{item.dimensions}</span>
                    <span className="label">{item.label}</span>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* TEMPLATE SECTION (MASONRY SAME AS POSTER) */}
          <div className="poster-popular-templates">
            <div className="popular-template-title">
              <h4>Templates</h4>
            </div>

            <div className="popular-template-cards">
              {filteredTemplates.length === 0 ? (
                  <div className="empty-state-wrapper">
                    <p>No templates found</p>
                  </div>
                ) : (
                  filteredTemplates.map((item, i) => (
                    <div
                      key={i}
                      className="template-card"
                      onClick={() => handleTemplateClick(item)}
                    >
                      <div className="template-image-wrapper">
                        <img src={item.img} className="template-image" />
                      </div>

                      <div className="template-content">
                        <p className="template-title">{item.title}</p>
                        <span className="template-dimension">{item.dimensions}</span>
                      </div>
                    </div>
                  ))
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}