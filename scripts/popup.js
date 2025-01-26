document.addEventListener("DOMContentLoaded", () => {
	if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
		chrome.storage.sync.get(["toggleState", "filterWords"], (result) => {
			const storedState = result.toggleState || "Replace";
			const storedFilter = result.filterWords || "";
			document.querySelector(`input[name="action"][value="${storedState}"]`).checked = true;
			document.querySelector('input[placeholder="Enter words to filter"]').value = storedFilter;
		});
	} else {
		const storedState = localStorage.getItem("toggleState") || "Replace";
		const storedFilter = localStorage.getItem("filterWords") || "";
		document.querySelector(`input[name="action"][value="${storedState}"]`).checked = true;
		document.querySelector('input[placeholder="Enter words to filter"]').value = storedFilter;
	}
});

document.querySelectorAll('input[name="action"]').forEach((elem) => {
	elem.addEventListener("change", function () {
		if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
			chrome.storage.sync.set({ toggleState: this.value });
		} else {
			localStorage.setItem("toggleState", this.value);
		}
	});
});

document.querySelector('input[placeholder="Enter words to filter"]').addEventListener("input", function () {
	if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
		chrome.storage.sync.set({ filterWords: this.value });
	} else {
		localStorage.setItem("filterWords", this.value);
	}
});

// Function to access the setting info
function getToggleState(callback) {
	if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
		chrome.storage.sync.get(["toggleState"], (result) => {
			const state = result.toggleState || "Replace";
			callback(state);
		});
	} else {
		const state = localStorage.getItem("toggleState") || "Replace";
		callback(state);
	}
}

// Function to set the replace state
function setReplaceState(state) {
	if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
		chrome.storage.sync.set({ toggleState: state });
	} else {
		localStorage.setItem("toggleState", state);
	}
}
