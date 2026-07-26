const test = require("node:test");
const assert = require("node:assert/strict");
const { JSDOM } = require("jsdom");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const script = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");

test("step 1 validates required fields and advances when valid", () => {
    const dom = new JSDOM(html, { runScripts: "outside-only", url: "http://localhost/" });
    const { window } = dom;
    const { document } = window;

    const originalWindow = global.window;
    const originalDocument = global.document;
    const originalHistory = global.history;

    global.window = window;
    global.document = document;
    global.history = window.history;
    global.URLSearchParams = window.URLSearchParams;
    global.URL = window.URL;

    window.eval(script);

    const form = document.getElementById("form-step-1");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");

    nameInput.value = "";
    emailInput.value = "john@test.com";
    phoneInput.value = "+1234567890";
    form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

    assert.match(document.querySelector("#name + .error").textContent, /required/i);

    nameInput.value = "John Doe";
    emailInput.value = "john@test.com";
    phoneInput.value = "+1234567890";
    form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

    assert.equal(document.querySelector(".step-active").id, "step-2");

    global.window = originalWindow;
    global.document = originalDocument;
    global.history = originalHistory;
});

test("billing toggle updates price visibility and summary pricing", () => {
    const dom = new JSDOM(html, { runScripts: "outside-only", url: "http://localhost/" });
    const { window } = dom;
    const { document } = window;

    const originalWindow = global.window;
    const originalDocument = global.document;
    const originalHistory = global.history;

    global.window = window;
    global.document = document;
    global.history = window.history;
    global.URLSearchParams = window.URLSearchParams;
    global.URL = window.URL;

    window.eval(script);

    const billingToggle = document.getElementById("billingToggle");
    billingToggle.checked = true;
    billingToggle.dispatchEvent(new window.Event("change", { bubbles: true }));

    const yearPrices = Array.from(document.querySelectorAll(".price-year"));
    assert.equal(
        yearPrices.every((price) => price.hidden === false),
        true,
    );

    const monthPrices = Array.from(document.querySelectorAll(".price-month"));
    assert.equal(
        monthPrices.every((price) => price.hidden === true),
        true,
    );

    global.window = originalWindow;
    global.document = originalDocument;
    global.history = originalHistory;
});
