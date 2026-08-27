"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js");

// Filter cards using their existing animal-type class.
const filterButtons = document.querySelectorAll("[data-filter]");
const animalCards = document.querySelectorAll(".animal-card");
filterButtons.forEach((button) => button.addEventListener("click", () => {
  const filter = button.dataset.filter;
  filterButtons.forEach((item) => { const active = item === button; item.classList.toggle("is-active", active); item.setAttribute("aria-pressed", String(active)); });
  animalCards.forEach((card) => { card.hidden = filter !== "all" && !card.classList.contains(filter); });
}));

// Open and close the mobile navigation without affecting desktop navigation.
const menuToggle = document.querySelector(".menu-toggle");
const mainNavigation = document.querySelector("#main-navigation");
function closeMenu() { if (menuToggle && mainNavigation) { mainNavigation.classList.remove("is-open"); menuToggle.setAttribute("aria-expanded", "false"); } }
if (menuToggle && mainNavigation) {
  menuToggle.addEventListener("click", () => { const open = mainNavigation.classList.toggle("is-open"); menuToggle.setAttribute("aria-expanded", String(open)); menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu"); });
  mainNavigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
}

// Switch themes and safely remember the preference when localStorage works.
const themeToggle = document.querySelector(".theme-toggle");
function applyTheme(theme) { document.documentElement.dataset.theme = theme; if (themeToggle) { const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme"; themeToggle.textContent = theme === "dark" ? "☀" : "☾"; themeToggle.setAttribute("aria-label", label); themeToggle.title = label; } }
if (themeToggle) { try { applyTheme(localStorage.getItem("paws-wings-theme") || "light"); } catch (error) { applyTheme("light"); } themeToggle.addEventListener("click", () => { const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; applyTheme(theme); try { localStorage.setItem("paws-wings-theme", theme); } catch (error) {} }); }

function updateStatus(element, message, error) { if (element) { element.textContent = message; element.classList.toggle("is-error", error); } }

// Reveal and validate the no-send adoption request prototype.
const adoptionForm = document.querySelector("#adoption-form");
const adoptionStatus = document.querySelector("#adoption-status");
const animalSelect = document.querySelector("#adoption-animal");
function openAdoptionForm(animal) { if (!adoptionForm) return; adoptionForm.hidden = false; if (animal && animalSelect) animalSelect.value = animal; adoptionForm.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" }); }
document.querySelectorAll(".adoption-trigger").forEach((button) => button.addEventListener("click", () => openAdoptionForm()));
document.querySelectorAll(".animal-card .text-link").forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); openAdoptionForm(button.closest(".animal-card")?.querySelector("h3")?.textContent); }));
if (adoptionForm) adoptionForm.addEventListener("submit", (event) => { event.preventDefault(); if (!adoptionForm.checkValidity()) { updateStatus(adoptionStatus, "Please complete every required field before sending your demo request.", true); adoptionForm.reportValidity(); return; } updateStatus(adoptionStatus, "Thank you! Your demo adoption request has been received.", false); adoptionForm.reset(); });

// Validate the no-send contact form and show helpful feedback.
const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");
if (contactForm) contactForm.addEventListener("submit", (event) => { event.preventDefault(); if (!contactForm.checkValidity()) { updateStatus(contactStatus, "Please add your name, email address, and message.", true); contactForm.reportValidity(); return; } updateStatus(contactStatus, "Thank you for your message! This demo enquiry has not been sent.", false); contactForm.reset(); });

// Donation cards remain informational and never collect payment details.
document.querySelectorAll(".support-card .text-link").forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); window.alert("Thank you for supporting our rescue work. This is a demo donation flow."); }));

// Reveal important page content gently as it enters the viewport.
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealItems = document.querySelectorAll(".section-heading, .animal-card, .gallery-item, .support-card, .adoption-layout, .visit-layout, .contact-layout");
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  revealItems.forEach((item) => { item.classList.add("reveal"); observer.observe(item); });
}
