import React, { useState } from "react";
import "./Createdesign.css";

import Poster11 from "../../../assets/Design-svg/poster.svg";
import Business11 from "../../../assets/Design-svg/Business.svg";
import Custom11 from "../../../assets/Design-svg/Custom.svg";
import Presentation11 from "../../../assets/Design-svg/Presentation.svg";

import PosterDesign from "./PosterDesign";
import BusinessCard from "./BusinessCard";
import Presentation from "./Presentation"
import CustomDesign from "./CustomDesign";

export default function Createdesign({ setShowCreatedesign }) {
  const [activeContainerMenu, setActiveContainerMenu] = useState("poster");

  const [projectName, setProjectName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const menuItems = [
    {
      id: "poster",
      label: "Poster",
      icon: Poster11,
      activeClass: "poster-active",
    },
    {
      id: "business",
      label: "Business Card",
      icon: Business11,
      activeClass: "business-active",
    },
    {
      id: "presentation",
      label: "Presentation",
      icon: Presentation11,
      activeClass: "presentation-active",
    },
    {
      id: "custom",
      label: "Custom Size",
      icon: Custom11,
      activeClass: "custom-active",
    },
  ];

  const handleCreateDesign = () => {
    console.log("Create Design");
  };

  return (
    <div className="app">
      <div className="modal-wrapper">
        <div className="container">

          <button
            className="close-btndesign"
            onClick={() => setShowCreatedesign(false)}
          >
            ✕
          </button>

          {/* Sidebar */}
          <div className="Designsidebar">
            <h2 className="sidebar-title">Create a Design</h2>

            <div className="createdesign-sidebar-menu">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveContainerMenu(item.id)}
                  className={`createdesign-sidebar-item ${
                    activeContainerMenu === item.id ? item.activeClass : ""
                  }`}
                >
                  <div className="icon-button">
                    <div className="icons-container">
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="icon-vector"
                      />
                    </div>
                  </div>

                  <span className="createdesign-sidebar-label">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="maincontainerdesign">
            {activeContainerMenu === "poster" && <PosterDesign />}

            {activeContainerMenu === "business" && <BusinessCard />}
            {activeContainerMenu === "presentation" && <Presentation />}
            {activeContainerMenu === "custom" && (
              <CustomDesign
                projectName={projectName}
                setProjectName={setProjectName}
                width={width}
                setWidth={setWidth}
                height={height}
                setHeight={setHeight}
                handleCreateDesign={handleCreateDesign}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}