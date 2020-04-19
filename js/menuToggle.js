const menuShowBtn = document.getElementById("menu-show-btn");
const menuHideBtn = document.getElementById("menu-hide-btn");
const menu = document.getElementById("menu");
const menuToggle = function () {
  menu.classList.toggle("hidden");
  menuShowBtn.classList.toggle("hidden");
  menuHideBtn.classList.toggle("hidden");
};
menuShowBtn.addEventListener("click", menuToggle);
menuHideBtn.addEventListener("click", menuToggle);
