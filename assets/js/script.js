'use strict';
const elementToggleFunc = function (elem) { if (elem) elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  if (modalContainer) modalContainer.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
}

// add click event to all modal items
if (testimonialsItem && testimonialsItem.length > 0) {
  for (let i = 0; i < testimonialsItem.length; i++) {
    const item = testimonialsItem[i];
    if (!item) continue;

    item.addEventListener("click", function () {
      const avatar = this.querySelector("[data-testimonials-avatar]");
      const title = this.querySelector("[data-testimonials-title]");
      const text = this.querySelector("[data-testimonials-text]");

      if (modalImg && avatar) {
        modalImg.src = avatar.src || "";
        modalImg.alt = avatar.alt || "";
      }
      if (modalTitle && title) modalTitle.innerHTML = title.innerHTML || "";
      if (modalText && text) modalText.innerHTML = text.innerHTML || "";

      testimonialsModalFunc();
    });
  }
}

// add click event to modal close button & overlay
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
if (selectItems && selectItems.length > 0) {
  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  }
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  if (!filterItems) return;
  for (let i = 0; i < filterItems.length; i++) {
    const it = filterItems[i];
    if (!it) continue;
    if (selectedValue === "all") {
      it.classList.add("active");
    } else if (selectedValue === it.dataset.category) {
      it.classList.add("active");
    } else {
      it.classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = (filterBtn && filterBtn.length) ? filterBtn[0] : null;

if (filterBtn && filterBtn.length > 0) {
  for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      if (lastClickedBtn) lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  }
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
if (formInputs && formInputs.length > 0) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      if (!form || !formBtn) return;
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Safe navigation: match page by data-page string instead of relying on indexes
if (navigationLinks && navigationLinks.length > 0 && pages && pages.length > 0) {
  navigationLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      const target = this.innerText.trim().toLowerCase();

      // show/hide pages
      pages.forEach(function (page) {
        if (page.dataset.page === target) {
          page.classList.add("active");
        } else {
          page.classList.remove("active");
        }
      });

      // update nav active state
      navigationLinks.forEach(function (lnk) {
        if (lnk === link) {
          lnk.classList.add("active");
        } else {
          lnk.classList.remove("active");
        }
      });

      window.scrollTo(0, 0);
    });
  });
}