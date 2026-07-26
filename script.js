//   ┌── [INFO] ──────────────────────────────────────────────────────────────────┐
//   │ Step 1                                                                     │
//   └────────────────────────────────────────────────────────────────────────────┘
const steps = Array.from(document.querySelectorAll(".step"));
const stepTitles = Array.from(document.querySelectorAll(".step-title"));
const formStep1 = document.getElementById("form-step-1");
const personalInputs = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
};
const personalErrors = {
    name: document.querySelector("#name + .error"),
    email: document.querySelector("#email + .error"),
    phone: document.querySelector("#phone + .error"),
};

const planData = {
    arcade: { label: "Arcade", monthly: 9, yearly: 90 },
    advanced: { label: "Advanced", monthly: 12, yearly: 120 },
    pro: { label: "Pro", monthly: 15, yearly: 150 },
};

const state = {
    currentStep: 1,
    billingMonthly: true,
    step1Completed: false,
    step2Completed: false,
    step3Completed: false,
    step4Completed: false,
    personalInfo: {
        name: "",
        email: "",
        phone: "",
    },
    selectedPlan: null,
    planPrice: 0,
    selectedAddons: [],
    addOnsPrice: 0,
};

const validationRules = {
    name: /^.{3,}$/,
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    phone: /^\+[1-9]\d{1,14}$/,
};

function formatPrice(value, monthly = true) {
    return `$${value}/${monthly ? "mo" : "yr"}`;
}

function setFieldError(input, errorElement, message) {
    input.classList.add("input-error");
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldError(input, errorElement) {
    input.classList.remove("input-error");
    if (errorElement) {
        errorElement.textContent = "";
    }
}

function validateField(fieldName, value) {
    if (value === "") {
        return { isValid: false, message: "this field is required" };
    }

    if (!validationRules[fieldName].test(value)) {
        return { isValid: false, message: "invalid format" };
    }

    return { isValid: true, message: "" };
}

function updateUI(stepNumber) {
    state.currentStep = stepNumber;

    steps.forEach((step, index) => {
        const isActive = index + 1 === stepNumber;
        step.classList.toggle("step-active", isActive);
        step.dataset.stepstate = String(isActive);
        step.setAttribute("aria-hidden", String(!isActive));
    });

    stepTitles.forEach((title, index) => {
        const isNavActive = index + 1 === stepNumber && stepNumber < 5;
        title.classList.toggle("nav-active", isNavActive);
    });
}

function updateUrl(stepNumber, replace = false) {
    const url = new URL(window.location.href);
    url.searchParams.set("step", String(stepNumber));
    const method = replace ? "replaceState" : "pushState";
    history[method]({ step: stepNumber }, "", `${url.pathname}${url.search}`);
}

function getValidStep(targetStep) {
    if (targetStep >= 2 && !state.step1Completed) {
        return 1;
    }

    return targetStep;
}

function goToStep(stepNumber) {
    updateUI(stepNumber);
    updateUrl(stepNumber);
}

function handlePersonalFieldInput(fieldName) {
    const input = personalInputs[fieldName];
    const errorElement = personalErrors[fieldName];
    const value = input.value.trim();
    const validation = validateField(fieldName, value);

    if (!validation.isValid) {
        setFieldError(input, errorElement, validation.message);
    } else {
        clearFieldError(input, errorElement);
    }

    state.personalInfo[fieldName] = value;
}

function validateStepOne() {
    const values = {};
    let isValid = true;

    Object.entries(personalInputs).forEach(([fieldName, input]) => {
        const value = input.value.trim();
        const validation = validateField(fieldName, value);
        const errorElement = personalErrors[fieldName];

        if (!validation.isValid) {
            setFieldError(input, errorElement, validation.message);
            isValid = false;
        } else {
            clearFieldError(input, errorElement);
        }

        values[fieldName] = value;
    });

    return { isValid, values };
}

function updateBillingUI() {
    const priceMonthSpans = document.querySelectorAll(".price-month");
    const priceYearSpans = document.querySelectorAll(".price-year");
    const discounts = document.querySelectorAll(".monthly-discount");

    priceMonthSpans.forEach((price) => {
        price.hidden = !state.billingMonthly;
    });

    priceYearSpans.forEach((price) => {
        price.hidden = state.billingMonthly;
    });

    discounts.forEach((discount) => {
        discount.classList.toggle("monthly-discount-show", !state.billingMonthly);
    });
}

function highlightPlanError() {
    const planCards = document.querySelectorAll(".plan-card");
    planCards.forEach((card) => card.classList.add("input-error"));

    window.setTimeout(() => {
        planCards.forEach((card) => card.classList.remove("input-error"));
    }, 2000);
}

function getSelectedPlan() {
    return document.querySelector('input[name="plan"]:checked');
}

function saveSelectedPlan() {
    const selectedPlanInput = getSelectedPlan();

    if (!selectedPlanInput) {
        return false;
    }

    const planKey = selectedPlanInput.value;
    const plan = planData[planKey];

    if (!plan) {
        return false;
    }

    state.selectedPlan = planKey;
    state.planPrice = state.billingMonthly ? plan.monthly : plan.yearly;
    state.step2Completed = true;
    return true;
}

function renderSummary() {
    const plan = planData[state.selectedPlan];

    if (!plan) {
        return;
    }

    const summaryPlanName = document.getElementById("summary-plan-name");
    const summaryPlanPrice = document.getElementById("summary-plan-price");
    const summaryAddonPrice1 = document.getElementById("summary-addon-price-1");
    const summaryAddonPrice2 = document.getElementById("summary-addon-price-2");
    const summaryAddonPrice3 = document.getElementById("summary-addon-price-3");
    const summaryTotalPrice = document.getElementById("summary-total-price");

    summaryPlanName.textContent = `${plan.label} (${state.billingMonthly ? "Monthly" : "Yearly"})`;
    summaryPlanPrice.textContent = formatPrice(
        state.billingMonthly ? plan.monthly : plan.yearly,
        state.billingMonthly,
    );

    const addonSummary = [
        {
            element: summaryAddonPrice1,
            container: document.getElementById("summary-addon-1"),
            input: document.getElementById("onlineService"),
        },
        {
            element: summaryAddonPrice2,
            container: document.getElementById("summary-addon-2"),
            input: document.getElementById("largerStorage"),
        },
        {
            element: summaryAddonPrice3,
            container: document.getElementById("summary-addon-3"),
            input: document.getElementById("customProfile"),
        },
    ];

    addonSummary.forEach(({ element, container, input }) => {
        const isActive = input.checked;
        container.setAttribute("data-addonstate", isActive ? "true" : "false");
        const priceValue = Number(
            input.dataset[state.billingMonthly ? "priceMonth" : "priceYear"],
        );
        element.textContent = isActive
            ? formatPrice(priceValue, state.billingMonthly)
            : formatPrice(priceValue, state.billingMonthly);
    });

    summaryTotalPrice.textContent = formatPrice(
        state.planPrice + state.addOnsPrice,
        state.billingMonthly,
    );
}

function resetSummaryState() {
    document.querySelectorAll(".summary-addon").forEach((item) => {
        item.setAttribute("data-addonstate", "false");
    });
}

function init() {
    Object.entries(personalInputs).forEach(([fieldName, input]) => {
        input.addEventListener("input", () => handlePersonalFieldInput(fieldName));
    });

    formStep1.addEventListener("submit", (event) => {
        event.preventDefault();
        const { isValid, values } = validateStepOne();

        if (!isValid) {
            return;
        }

        state.personalInfo = values;
        state.step1Completed = true;
        goToStep(2);
    });

    const billingToggle = document.getElementById("billingToggle");
    billingToggle.addEventListener("change", () => {
        state.billingMonthly = !billingToggle.checked;
        updateBillingUI();
    });

    const toStep1BackBtn = document.getElementById("toStep1BackBtn");
    const toStep3NextBtn = document.getElementById("toStep3NextBtn");
    const toStep2BackBtn = document.getElementById("toStep2BackBtn");
    const toStep4NextBtn = document.getElementById("toStep4NextBtn");
    const btnChangePlan = document.getElementById("btn-change-plan");
    const toStep3BackBtn = document.getElementById("toStep3BackBtn");
    const toStep5ConfirmBtn = document.getElementById("toStep5ConfirmBtn");

    toStep1BackBtn.addEventListener("click", () => {
        goToStep(1);
    });

    toStep3NextBtn.addEventListener("click", () => {
        if (!saveSelectedPlan()) {
            highlightPlanError();
            return;
        }

        goToStep(3);
    });

    toStep2BackBtn.addEventListener("click", () => {
        state.step3Completed = false;
        goToStep(2);
    });

    toStep4NextBtn.addEventListener("click", () => {
        const addonInputs = Array.from(document.querySelectorAll('input[name="addon"]'));
        const selectedAddons = addonInputs.filter((input) => input.checked);

        state.selectedAddons = selectedAddons.map((input) => input.value);
        state.addOnsPrice = selectedAddons.reduce((total, input) => {
            const priceValue = Number(
                input.dataset[state.billingMonthly ? "priceMonth" : "priceYear"],
            );
            return total + priceValue;
        }, 0);
        state.step2Completed = true;
        state.step3Completed = true;
        state.step4Completed = true;
        renderSummary();
        goToStep(4);
    });

    toStep3BackBtn.addEventListener("click", () => {
        resetSummaryState();
        state.step4Completed = false;
        goToStep(3);
    });

    toStep5ConfirmBtn.addEventListener("click", () => {
        state.step4Completed = true;
        goToStep(5);
    });

    btnChangePlan.addEventListener("click", () => {
        state.step4Completed = false;
        goToStep(2);
    });

    window.addEventListener("popstate", (event) => {
        const stepNumber = event.state ? event.state.step : 1;
        updateUI(stepNumber);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const requestedStep = Number.parseInt(urlParams.get("step"), 10) || 1;
    const initialStep = getValidStep(requestedStep);

    updateUrl(initialStep, true);
    updateBillingUI();
    updateUI(initialStep);
}

init();
