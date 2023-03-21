// Get DOM elements
const currentTimeInput = document.getElementById("current"); // Where the current time is displayed
const currentTimeZone = document.getElementById("currentTimeZone"); // Where the current timezone is displayed
const targetTimezoneInput = document.getElementById("target"); // Where the user enters the timezone they want to convert to
const timezonesDatalist = document.getElementById("timezones"); // The datalist that contains all the timezones
const timezoneTime = document.getElementById("timezonetime"); // Where the converted time is displayed
const convertButton = document.getElementById("convert"); // The button that converts the time
let timezonesfetched = [];

const resetAll = () => {
    // Remove all error messages from DOM
    document.querySelectorAll(".error").forEach((alert) => alert.remove());
};

const getCurrentTime = async () => {
    const timeResponse = await fetch("https://worldtimeapi.org/api/ip");
    const timeData = await timeResponse.json();
    currentTimeInput.value = timeData.datetime.slice(11, 19);
};

const getCurrentTimezone = async () => {
    // Get current timezone from API
    const timezoneResponse = await fetch("https://worldtimeapi.org/api/ip");
    const timezoneData = await timezoneResponse.json();
    currentTimeZone.textContent = timezoneData.timezone;
};

const fetchAvailableTimezones = async () => {
    try {
        // Get a list of all timezones from API
        const timezonesRes = await fetch(
            "https://worldtimeapi.org/api/timezone"
        );
        const timezones = await timezonesRes.json(); // Convert response to JSON

        // Add the timezones to the timezonesfetched array
        timezones.forEach((timezone) => {
            timezonesfetched.push(timezone);
        });
        // Add all timezones to datalist
        timezones.forEach((timezone) => {
            const option = document.createElement("option");
            option.value = timezone;
            timezonesDatalist.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
};

const convertTime = async (timezone = targetTimezoneInput.value) => {
    try {
        // Get timezone data from API
        const timezoneResponse = await fetch(
            `https://worldtimeapi.org/api/timezone/${timezone}`
        );
        const timezoneData = await timezoneResponse.json();

        // Check if timezone is valid
        if (timezoneData.error) {
            throw new Error(timezoneData.error);
        }

        // get only HH:MM:SS from datetime string and display it
        const timezoneTimeStr = timezoneData.datetime.slice(11, 19);
        timezoneTime.value = timezoneTimeStr;
    } catch (error) {
        // Display error message
        const alertBox = document.createElement("div");

        // Add class .error to alert box
        alertBox.classList.add("error");

        // Add error message to alert box
        alertBox.innerText = error.message;

        // Add alert box to DOM
        document.body.appendChild(alertBox);
    }
};
let interval;
let bothInterval;

// Set current time on page load
window.onload = async () => {
    // create a interval to update the time every second and will be cleared when button is clicked
    interval = setInterval(() => {
        getCurrentTime();
    }, 1000);
    getCurrentTimezone(); // Get current timezone
    fetchAvailableTimezones(); // Get all available timezones and add them to the datalist
};

// Convert time to selected timezone on button click
convertButton.addEventListener("click", async (e) => {
    // Clear interval that updates the time every second
    clearInterval(interval);
    clearInterval(bothInterval);
    e.preventDefault(); // Prevent page from reloading
    resetAll(); // Remove all error messages from DOM
    bothInterval = setInterval(() => {
        getCurrentTime(); // Get current time
        convertTime(); // Convert time to selected timezone
    }, 1000);
});

targetTimezoneInput.addEventListener("input", (e) => {
    clearInterval(interval);
    clearInterval(bothInterval);
    if (timezonesfetched.includes(e.target.value.trim())) {
        convertButton.disabled = false;
    } else {
        convertButton.disabled = true;
    }
});

const darkModeInput = document.getElementById("checkbox");
darkModeInput.addEventListener("change", (e) => {
    if (darkModeInput.checked) {
        document.body.classList.add("light");
    } else {
        document.body.classList.remove("light");
    }
});
