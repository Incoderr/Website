import React, { useState, useEffect, useRef } from "react";
import HeaderEl from "../components/HeaderEl";
import "../css/Categories.css";

function Categories() {
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains("mobile-filter-toggle")
      ) {
        setIsMobileFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <HeaderEl />
      <main className="all-padding">
        <div className="CategoriesBox">
          {/* Desktop Sidebar */}
          <div className="side-bar desktop-categories">
            <h2>Категории</h2>
            <hr />
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
          </div>
          {/* Mobile Categories Dropdown */}
          {isMobileFilterOpen && (
            <div ref={dropdownRef} className="mobile-categories-dropdown">
              <h2>Категории</h2>
              <hr />
              <p>1</p>
              <p>2</p>
              <p>3</p>
              <p>4</p>
            </div>
          )}

          <div className="CategorieCardBox">
            <div className="NavContainer">
              <div className="CategorieNavigate">
                <i
                  className={`bi bi-filter fs-3 icon-box mobile-filter-icon ${
                    viewMode === "filter" ? "active" : ""
                  }`}
                  onClick={() => {
                    setViewMode("filter");
                    toggleMobileFilter();
                  }}
                ></i>
                <i
                  className={`bi bi-grid fs-3 icon-box ${
                    viewMode === "grid" ? "active" : ""
                  }`}
                  onClick={() => handleViewChange("grid")}
                ></i>
                <i
                  className={`bi bi-list fs-3 icon-box ${
                    viewMode === "list" ? "active" : ""
                  }`}
                  onClick={() => handleViewChange("list")}
                ></i>
                <input type="text" />
              </div>
            </div>
            <div
              className={`CardContainer ${
                viewMode === "list" ? "list-view" : ""
              }`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((card) => (
                <div
                  key={card}
                  className={`CategorieCard ${
                    viewMode === "list" ? "list-card" : ""
                  }`}
                >
                  {viewMode === "list" ? (
                    <div className="list-card-content">
                      <div className="CategorieCard"></div>
                      <div className="list-card-text">
                        <h3>Название книги</h3>
                        <p>Краткое описание книги</p>
                        <p>Автор: Имя Автора</p>
                      </div>
                    </div>
                  ) : (
                    <div className="CategorieCard">
                      <div className="CategorieCard-count">
                        <div className="CategorieCard-image">
                          <div className="test-card"></div>
                        </div>
                        <div className="grid-card-title">
                          <h3>Название</h3>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Categories;
