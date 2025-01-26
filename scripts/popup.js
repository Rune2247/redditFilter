document.addEventListener("DOMContentLoaded", () => {
	if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
		chrome.storage.sync.get(["toggleState", "filterWords", "hideAuthors"], (result) => {
			const storedState = result.toggleState || "Replace";
			const storedFilter = result.filterWords || "";
			const storedHideAuthors = result.hideAuthors || false;
			document.querySelector(`input[name="action"][value="${storedState}"]`).checked = true;
			document.querySelector('input[placeholder="Enter words to filter"]').value = storedFilter;
			document.querySelector('input[name="hideAuthors"]').checked = storedHideAuthors;
			toggleHideAuthorsCheckbox(storedState);
		});
	} else {
		const storedState = localStorage.getItem("toggleState") || "Replace";
		const storedFilter = localStorage.getItem("filterWords") || "";
		const storedHideAuthors = localStorage.getItem("hideAuthors") || false;
		document.querySelector(`input[name="action"][value="${storedState}"]`).checked = true;
		document.querySelector('input[placeholder="Enter words to filter"]').value = storedFilter;
		document.querySelector('input[name="hideAuthors"]').checked = storedHideAuthors;
		toggleHideAuthorsCheckbox(storedState);
	}
});

document.querySelectorAll('input[name="action"]').forEach((elem) => {
	elem.addEventListener("change", function () {
		if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
			chrome.storage.sync.set({ toggleState: this.value });
		} else {
			localStorage.setItem("toggleState", this.value);
		}
		toggleHideAuthorsCheckbox(this.value);
	});
});

document.querySelector('input[placeholder="Enter words to filter"]').addEventListener("input", function () {
	if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
		chrome.storage.sync.set({ filterWords: this.value });
	} else {
		localStorage.setItem("filterWords", this.value);
	}
});

document.querySelector('input[name="hideAuthors"]').addEventListener("change", function () {
	if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
		chrome.storage.sync.set({ hideAuthors: this.checked });
	} else {
		localStorage.setItem("hideAuthors", this.checked);
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

function toggleHideAuthorsCheckbox(state) {
	const hideAuthorsCheckbox = document.querySelector('input[name="hideAuthors"]').closest('.checkbox-group');
	if (state.toLowerCase() === "delete") {
		hideAuthorsCheckbox.style.display = "none";
	} else {
		hideAuthorsCheckbox.style.display = "block";
	}
}
