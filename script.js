//   ┌── [INFO] ──────────────────────────────────────────────────────────────────┐
//   │ step 1                                                                     │
//   └────────────────────────────────────────────────────────────────────────────┘
const steps = document.querySelectorAll(".step");
const formStep1 = document.getElementById("form-step-1");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const errorMessages = document.querySelectorAll(".error");
const stepTitles = document.querySelectorAll(".step-title");

const stepOne = 1;
const stepTwo = 2;
const stepThree = 3;
const stepFour = 4;

const stepData = {
    onlineService: 0,
    storage: 0,
    profile: 0,
    name: null,
    email: null,
    phone: null,
    plan: null,
    price: null,
    addOnsPrice: null
};

const stepState = {
    step1: false,
    step2: false,
    step3: false,
    step4: false
}

const errorState = {
    name: /^.{3,}$/,
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    phone: /^\+[1-9]\d{1,14}$/,
}

function updateUI(stepNumber) {
    steps.forEach((step, index) => {
        step.classList.remove("step-active");
        step.dataset.stepstate = "false";
        step.setAttribute("aria-hidden", "true");
        
        if (index < 4) {
            stepTitles[index].classList.remove("nav-active");
        }
    });

    const currentStepIndex = stepNumber - 1;
    if (steps[currentStepIndex]) {
        steps[currentStepIndex].classList.add("step-active");
        steps[currentStepIndex].dataset.stepstate = "true";
        steps[currentStepIndex].setAttribute("aria-hidden", "false");
    }
    
    const navIndex = currentStepIndex < 4 ? currentStepIndex : 3;
    if (stepTitles[navIndex]) {
        stepTitles[navIndex].classList.add("nav-active");
    }
}

function goToStep(stepNumber) {
    updateUI(stepNumber);
    history.pushState({ step: stepNumber }, "", `?step=${stepNumber}`);
}

window.addEventListener("popstate", (event) => {
    const stepNumber = event.state ? event.state.step : 1;
    updateUI(stepNumber);
});

function getValidStep(targetStep) {
    if (targetStep >= 2 && !stepState.step1) return 1;
    // На будущее для Step 3 / Step 4:
    // if (targetStep >= 3 && !stepState.step2) return 2;
    return targetStep;
}

// Initialize state
const urlParams = new URLSearchParams(window.location.search);
const requestedStep = parseInt(urlParams.get("step")) || 1;
const initialStep = getValidStep(requestedStep);
history.replaceState({ step: initialStep }, "", `?step=${initialStep}`);
updateUI(initialStep);

const nextStep = () => {
    const currentStepIndex = [...steps].findIndex(step => step.dataset.stepstate === "true");
    if (currentStepIndex >= 0 && currentStepIndex < steps.length - 1) {
        goToStep(currentStepIndex + 2);
    }
}


nameInput.addEventListener("input", () => {
    const name = nameInput.value.trim();
    if (name === "") {
        errorMessages[0].textContent = "this field is required";
        nameInput.className = "input-error";
    } else if (!errorState.name.test(name)) {
        errorMessages[0].textContent = "invalid format";
        nameInput.className = "input-error";
    } else {
        errorMessages[0].textContent = "";
        nameInput.className = "";
    }
});
emailInput.addEventListener("input", () => {
    const email = emailInput.value.trim();
    if (email === "") {
        errorMessages[1].textContent = "this field is required";
        emailInput.className = "input-error";
    } else if (!errorState.email.test(email)) {
        errorMessages[1].textContent = "invalid format";
        emailInput.className = "input-error";
    } else {
        errorMessages[1].textContent = "";
        emailInput.className = "";
    }
});
phoneInput.addEventListener("input", () => {
    const phone = phoneInput.value.trim();
    if (phone === "") {
        errorMessages[2].textContent = "this field is required";
        phoneInput.className = "input-error";
    } else if (!errorState.phone.test(phone)) {
        errorMessages[2].textContent = "invalid format";
        phoneInput.className = "input-error";
    } else {
        errorMessages[2].textContent = "";
        phoneInput.className = "";
    }
});

formStep1.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    let isValid = true;

    if (name === "") {
        nameInput.className = "input-error";
        errorMessages[0].textContent = "this field is required";
        isValid = false;
    } else if (!errorState.name.test(name)) {
        nameInput.className = "input-error";
        errorMessages[0].textContent = "invalid format";
        isValid = false;
    } else {
        nameInput.className = "";
        errorMessages[0].textContent = "";
    }

    if (email === "") {
        emailInput.className = "input-error";
        errorMessages[1].textContent = "this field is required";
        isValid = false;
    } else if (!errorState.email.test(email)) {
        emailInput.className = "input-error";
        errorMessages[1].textContent = "invalid format";
        isValid = false;
    } else {
        emailInput.className = "";
        errorMessages[1].textContent = "";
    }

    if (phone === "") {
        phoneInput.className = "input-error";
        errorMessages[2].textContent = "this field is required";
        isValid = false;
    } else if (!errorState.phone.test(phone)) {
        phoneInput.className = "input-error";
        errorMessages[2].textContent = "invalid format";
        isValid = false;
    } else {
        phoneInput.className = "";
        errorMessages[2].textContent = "";
    }

    if (isValid) {
        stepData.name = name;
        stepData.email = email;
        stepData.phone = phone;
        stepState.step1 = true;
        nextStep();
    }
});

//   ┌── [INFO] ──────────────────────────────────────────────────────────────────┐
//   │ step 2                                                                     │
//   └────────────────────────────────────────────────────────────────────────────┘

const billingToggle = document.getElementById("billingToggle");
const planPrice = document.querySelectorAll(".plan-price span");
const arcade = document.getElementById("arcade");
const advanced = document.getElementById("advanced");
const pro = document.getElementById("pro");
const toStep1BackBtn = document.getElementById("toStep1BackBtn");
const toStep3NextBtn = document.getElementById("toStep3NextBtn");
const planCard = document.querySelectorAll(".plan-card");
const addOnPrice = document.querySelectorAll(".addon-price span");

const planData = {
    arcade: {
        monthly: 9,
        yearly: 90
    },
    advanced: {
        monthly: 12,
        yearly: 120
    },
    pro: {
        monthly: 15,
        yearly: 150
    }
};

let isBillingMonthly = true;

billingToggle.addEventListener("change", () => {
    const priceMonthSpan = document.querySelectorAll(".price-month");
    const priceYearSpan = document.querySelectorAll(".price-year");
    if (billingToggle.checked) {
        isBillingMonthly = false;
        priceMonthSpan.forEach((price) => price.hidden = true);
        priceYearSpan.forEach((price) => price.hidden = false);
    } else {
        isBillingMonthly = true;
        priceMonthSpan.forEach((price) => price.hidden = false);
        priceYearSpan.forEach((price) => price.hidden = true);
    }
    console.log(priceYearSpan)
    console.log(priceMonthSpan)
});

toStep1BackBtn.addEventListener("click", () => {
    goToStep(1);
});

toStep3NextBtn.addEventListener("click", () => {
        if (arcade.checked) {
            stepData.plan = "arcade";
            stepData.price = isBillingMonthly ? planData.arcade.monthly : planData.arcade.yearly;
            goToStep(3);
        } else if (advanced.checked) {
            stepData.plan = "advanced";
            stepData.price = isBillingMonthly ? planData.advanced.monthly : planData.advanced.yearly;
            goToStep(3);
        } else if (pro.checked) {
            stepData.plan = "pro";
            stepData.price = isBillingMonthly ? planData.pro.monthly : planData.pro.yearly;
            goToStep(3);
        }else {
            planCard.forEach((card) => card.classList.add("input-error"));
            setTimeout(() => {
                planCard.forEach((card) => card.classList.remove("input-error"));
            }, 2000);
        }
    console.log(stepData);
});


//   ┌── [INFO] ──────────────────────────────────────────────────────────────────┐
//   │ step 3                                                                     │
//   └────────────────────────────────────────────────────────────────────────────┘

const toStep2BackBtn = document.getElementById("toStep2BackBtn");
const toStep4NextBtn = document.getElementById("toStep4NextBtn");

const summaryPlanName = document.getElementById("summary-plan-name");
const summaryPlanPrice = document.getElementById("summary-plan-price");

const summaryAddonPrice1 = document.getElementById("summary-addon-price-1");
const summaryAddonPrice2 = document.getElementById("summary-addon-price-2");
const summaryAddonPrice3 = document.getElementById("summary-addon-price-3");
const summaryTotalPrice = document.getElementById("summary-total-price");

toStep2BackBtn.addEventListener("click", () => {
    stepData.step3 = false;
    goToStep(2);
});

toStep4NextBtn.addEventListener("click", () => {
    stepData.step3 = true;
    const onlineService = document.getElementById("onlineService");
    const storage = document.getElementById("largerStorage");
    const profile = document.getElementById("customProfile");
    let addOnsPrice = 0
    if (onlineService.checked) {
        stepData.onlineService = 1;
        addOnsPrice += isBillingMonthly ? 1 : 10;
    } else {
        stepData.onlineService = 0;
    }
    if (storage.checked) {
        stepData.storage = 1;
        addOnsPrice += isBillingMonthly ? 2 : 20;
    } else {
        stepData.storage = 0;
    }
    if (profile.checked) {
        stepData.profile = 1;
        addOnsPrice += isBillingMonthly ? 2 : 20;
    } else {
        stepData.profile = 0;
    }
    stepData.addOnsPrice = addOnsPrice;

    if (stepData.plan === "arcade") {
        summaryPlanName.textContent = "Arcade";
        summaryPlanPrice.textContent = isBillingMonthly ? "$9/mo" : "$90/yr";
        summaryAddonPrice1.textContent = isBillingMonthly ? "$1/mo" : "$10/yr";
        summaryAddonPrice2.textContent = isBillingMonthly ? "$2/mo" : "$20/yr";
        summaryAddonPrice3.textContent = isBillingMonthly ? "$2/mo" : "$20/yr";
    } else if (stepData.plan === "advanced") {
        summaryPlanName.textContent = "Advanced";
        summaryPlanPrice.textContent = isBillingMonthly ? "$12/mo" : "$120/yr";
        summaryAddonPrice1.textContent = isBillingMonthly ? "$1/mo" : "$10/yr";
        summaryAddonPrice2.textContent = isBillingMonthly ? "$2/mo" : "$20/yr";
        summaryAddonPrice3.textContent = isBillingMonthly ? "$2/mo" : "$20/yr";
    } else if (stepData.plan === "pro") {
        summaryPlanName.textContent = "Pro";
        summaryPlanPrice.textContent = isBillingMonthly ? "$15/mo" : "$150/yr";
        summaryAddonPrice1.textContent = isBillingMonthly ? "$1/mo" : "$10/yr";
        summaryAddonPrice2.textContent = isBillingMonthly ? "$2/mo" : "$20/yr";
        summaryAddonPrice3.textContent = isBillingMonthly ? "$2/mo" : "$20/yr";
    }
    if (stepData.onlineService === 1) {
        summaryAddonPrice1.textContent = isBillingMonthly ? "$1/mo" : "$10/yr";
        summaryAddonPrice1.parentElement.setAttribute("data-addonstate", "true");
    }
    if (stepData.storage === 1) {
        summaryAddonPrice2.textContent = isBillingMonthly ? "$2/mo" : "$20/yr";
        summaryAddonPrice2.parentElement.setAttribute("data-addonstate", "true");
    }
    if (stepData.profile === 1) {
        summaryAddonPrice3.textContent = isBillingMonthly ? "$2/mo" : "$20/yr";
        summaryAddonPrice3.parentElement.setAttribute("data-addonstate", "true");
    }
    summaryTotalPrice.textContent = stepData.price + stepData.addOnsPrice;
    goToStep(4);
    console.log(stepData);
});

//   ┌── [INFO] ──────────────────────────────────────────────────────────────────┐
//   │ step 4                                                                     │
//   └────────────────────────────────────────────────────────────────────────────┘


const btnChangePlan = document.getElementById("btn-change-plan");
const toStep3BackBtn = document.getElementById("toStep3BackBtn");
const toStep5ConfirmBtn = document.getElementById("toStep5ConfirmBtn");
toStep3BackBtn.addEventListener("click", () => {
    summaryAddonPrice1.parentElement.setAttribute("data-addonstate", "false");
    summaryAddonPrice2.parentElement.setAttribute("data-addonstate", "false");
    summaryAddonPrice3.parentElement.setAttribute("data-addonstate", "false");
    stepData.step4 = false;
    goToStep(3);
});
toStep5ConfirmBtn.addEventListener("click", () => {
    stepData.step4 = true;
    goToStep(5);
});    

btnChangePlan.addEventListener("click", () => {
    stepData.step4 = false;
    goToStep(2);
});