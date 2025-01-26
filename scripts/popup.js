document.addEventListener("DOMContentLoaded", () => {
	console.log("DOMContentLoaded event fired");
	if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
		chrome.storage.sync.get(["toggleState"], (result) => {
			const storedState = result.toggleState || "Replace";
			console.log("Stored state from chrome.storage.sync:", storedState);
			document.querySelector(`input[name="action"][value="${storedState}"]`).checked = true;
		});
	} else {
		const storedState = localStorage.getItem("toggleState") || "Replace";
		console.log("Stored state from localStorage:", storedState);
		document.querySelector(`input[name="action"][value="${storedState}"]`).checked = true;
	}
});

document.querySelectorAll('input[name="action"]').forEach((elem) => {
	elem.addEventListener("change", function () {
		console.log("Radio button changed:", this.value);
		if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
			chrome.storage.sync.set({ toggleState: this.value }, () => {
				console.log("State saved to chrome.storage.sync:", this.value);
			});
		} else {
			localStorage.setItem("toggleState", this.value);
			console.log("State saved to localStorage:", this.value);
		}
	});
});

// Function to access the setting info
function getToggleState(callback) {
	if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
		chrome.storage.sync.get(["toggleState"], (result) => {
			const state = result.toggleState || "Replace";
			console.log("getToggleState from chrome.storage.sync:", state);
			callback(state);
		});
	} else {
		const state = localStorage.getItem("toggleState") || "Replace";
		console.log("getToggleState from localStorage:", state);
		callback(state);
	}
}

// Function to set the replace state
function setReplaceState(state) {
	if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
		chrome.storage.sync.set({ toggleState: state }, () => {
			console.log("setReplaceState saved to chrome.storage.sync:", state);
		});
	} else {
		localStorage.setItem("toggleState", state);
		console.log("setReplaceState saved to localStorage:", state);
	}
}
