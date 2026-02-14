// ===============================
// EscapeCall Web App – index.js
// ===============================

// -------------------------------
// GLOBAL STATE
// -------------------------------
let settings = JSON.parse(localStorage.getItem("settings")) || {
    hasPaidCallFeature: false,
    defaultQuickRingProfileId: null,
    defaultQuickTextProfileId: null,
};

let textPresets = JSON.parse(localStorage.getItem("textPresets")) || [];
let callPresets = JSON.parse(localStorage.getItem("callPresets")) || [];
let profiles = JSON.parse(localStorage.getItem("profiles")) || [];
let scheduledEvents = JSON.parse(localStorage.getItem("scheduledEvents")) || [];

// -------------------------------
// SAVE HELPERS
// -------------------------------
function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
}
function saveTextPresets() {
    localStorage.setItem("textPresets", JSON.stringify(textPresets));
}
function saveCallPresets() {
    localStorage.setItem("callPresets", JSON.stringify(callPresets));
}
function saveProfiles() {
    localStorage.setItem("profiles", JSON.stringify(profiles));
}
function saveEvents() {
    localStorage.setItem("scheduledEvents", JSON.stringify(scheduledEvents));
}

// -------------------------------
// UTILS
// -------------------------------
function uuid() {
    return crypto.randomUUID();
}

function scheduleEvent(type, delayMinutes, presetId, profileId = null) {
    const event = {
        id: uuid(),
        type,
        presetId,
        profileId,
        time: Date.now() + delayMinutes * 60 * 1000,
        status: "pending",
    };

    scheduledEvents.push(event);
    saveEvents();

    startEventTimer(event);
}

function startEventTimer(event) {
    const msUntil = event.time - Date.now();

    if (msUntil <= 0) {
        triggerEvent(event);
        return;
    }

    setTimeout(() => triggerEvent(event), msUntil);
}

// -------------------------------
// EVENT TRIGGER
// -------------------------------
function triggerEvent(event) {
    event.status = "sent";
    saveEvents();

    if (event.type === "call") {
        showFakeCall(event);
    } else if (event.type === "text") {
        showFakeText(event);
    }
}

// -------------------------------
// FAKE CALL UI
// -------------------------------
function showFakeCall(event) {
    const preset = callPresets.find(p => p.id === event.presetId);
    if (!preset) return;

    const callScreen = document.getElementById("fakeCallScreen");
    const callerName = document.getElementById("callerName");
    const callerMode = document.getElementById("callerMode");

    callerName.textContent = preset.callerName;
    callerMode.textContent = preset.mode;

    callScreen.style.display = "flex";

    const ringtone = new Audio("ringtone.mp3");
    ringtone.loop = true;
    ringtone.play();

    document.getElementById("acceptCall").onclick = () => {
        ringtone.pause();
        alert("Call connected (fake). Voice playback coming soon.");
        callScreen.style.display = "none";
    };

    document.getElementById("declineCall").onclick = () => {
        ringtone.pause();
        callScreen.style.display = "none";
    };
}

// -------------------------------
// FAKE TEXT UI
// -------------------------------
function showFakeText(event) {
    const preset = textPresets.find(p => p.id === event.presetId);
    if (!preset) return;

    const textPopup = document.getElementById("fakeTextPopup");
    const textMessage = document.getElementById("fakeTextMessage");

    textMessage.textContent = preset.messageText;
    textPopup.style.display = "block";

    setTimeout(() => {
        textPopup.style.display = "none";
    }, 6000);
}

// -------------------------------
// QUICK ACTIONS
// -------------------------------
function quickRing(minutes) {
    const profile = profiles.find(p => p.id === settings.defaultQuickRingProfileId);
    if (!profile || !profile.callPresetId) return;

    scheduleEvent("call", minutes, profile.callPresetId, profile.id);
}

function quickText(minutes) {
    const profile = profiles.find(p => p.id === settings.defaultQuickTextProfileId);
    if (!profile || !profile.textPresetId) return;

    scheduleEvent("text", minutes, profile.textPresetId, profile.id);
}

// -------------------------------
// PAYWALL
// -------------------------------
function unlockPaidFeature() {
    settings.hasPaidCallFeature = true;
    saveSettings();
    alert("Call feature unlocked!");
}

// -------------------------------
// INITIALIZE TIMERS ON PAGE LOAD
// -------------------------------
window.onload = () => {
    scheduledEvents
        .filter(e => e.status === "pending")
        .forEach(startEventTimer);
};
