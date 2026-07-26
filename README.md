# Frontend Mentor - Multi-step form solution

This is a solution to the [Multi-step form challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/multistep-form-YVAnSdqQBJ). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
    - [The challenge](#the-challenge)
    - [Screenshot](#screenshot)
    - [Links](#links)
- [My process](#my-process)
    - [Built with](#built-with)
    - [What I learned](#what-i-learned)
    - [Continued development](#continued-development)
- [Author](#author)

---

## Overview

### The challenge

Users should be able to:

- Complete each step of the sequence
- Go back to a previous step to update their selections
- See a summary of their selections on the final step and confirm their order
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- Receive form validation messages if:
    - A field has been missed
    - The email address is not formatted correctly
    - The phone number is not formatted correctly
- Navigate steps using native browser **Back/Forward** buttons via History API

### Links

- **Solution URL:** [GitHub Repository](https://github.com/DHayk87/Multi-step-form)
- **Live Site URL:** [GitHub Pages Demo](https://dhayk87.github.io/Multi-step-form/)

---

## My process

### Built with

- Semantic **HTML5** markup
- **CSS3** custom properties & Flexbox
- **Mobile-first** workflow & Responsive Design
- **Vanilla JavaScript** (ES6+)
- **History API** (`pushState`, `popstate`, `URLSearchParams`) for stateful step navigation

### What I learned

1. **Managing Multi-Step Navigation with History API:**
   Integrating `history.pushState` and handling the `popstate` event allowed me to link form steps with URL query parameters (`?step=N`). This delivers a seamless UX where browser navigation buttons work as expected.

    ```js
    function goToStep(stepNumber) {
        updateUI(stepNumber);
        history.pushState({ step: stepNumber }, "", `?step=${stepNumber}`);
    }

    window.addEventListener("popstate", (event) => {
        const stepNumber = event.state ? event.state.step : 1;
        updateUI(stepNumber);
    });
    ```

2. **Regex Input Validation:**
   Implemented clean real-time and submit-time validation using regular expressions for phone numbers, email addresses, and general input length constraints.

### Continued development

In future iterations of this project, I plan to:

- Implement `localStorage` synchronization to persist form state across page reloads.
- Enhance accessibility by adding `aria-live` regions and managing focus states during step transitions.
- Modularize the codebase using ES6 modules for cleaner separation of concerns.

---

## Author

- GitHub - [@DHayk87](https://www.google.com/search?q=https://github.com/DHayk87)
- Frontend Mentor - [@DHayk87](https://www.google.com/search?q=https://www.frontendmentor.io/profile/DHayk87)
