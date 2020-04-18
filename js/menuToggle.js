const idSelect = function (id) {
  return document.getElementById(id);
};
const toggle = function toggle(element, clazz) {
  element.classList.toggle(clazz);
};
const menuShowBtn = idSelect("menu-show-btn");
const menuHideBtn = idSelect("menu-hide-btn");
const menuToggle = function () {
  toggle(idSelect("menu"), "hidden");
  toggle(menuShowBtn, "hidden");
  toggle(menuHideBtn, "hidden");
};
menuShowBtn.addEventListener("click", menuToggle);
menuHideBtn.addEventListener("click", menuToggle);
