// Get DOM elements
const currentTimeInput = document.getElementById("current");
const targetTimezoneInput = document.getElementById("target");
const timezoneTime = document.getElementById("timezonetime");
const convertButton = document.getElementById("convert");
const timezonesDatalist = document.getElementById("timezones");

// Set current time on page load
window.onload = async () => {
    const currentTime = new Date();
    currentTimeInput.value = currentTime.toLocaleTimeString("en-US", {
        hour12: false,
    });

    try {
        // Get a list of all timezones from API
        const timezonesRes = await fetch(
            "https://worldtimeapi.org/api/timezone"
        );
        const timezones = await timezonesRes.json();

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

// Convert time to selected timezone on button click
convertButton.addEventListener("click", async () => {
    // Delete any existing error messages
    document.querySelectorAll(".error").forEach((alert) => alert.remove());

    const timezone = targetTimezoneInput.value;

    try {
        // Get timezone data from API
        const timezoneResponse = await fetch(
            `https://worldtimeapi.org/api/timezone/${timezone}`
        );

        const timezoneData = await timezoneResponse.json();

        if (timezoneData.error) {
            throw new Error(timezoneData.error);
        }

        const timezoneTimeStr = timezoneData.datetime.slice(11, 19);
        timezoneTime.value = timezoneTimeStr;
    } catch (error) {
        console.error(error);
        // Display error message in a red alert box
        const alertBox = document.createElement("div");

        // Add class .error to alert box
        alertBox.classList.add("error");

        // Add error message to alert box
        alertBox.innerText = error.message;

        // Add alert box to DOM
        document.body.appendChild(alertBox);
    }
});
