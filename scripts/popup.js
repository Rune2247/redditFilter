document.addEventListener("DOMContentLoaded", () => {
	const storedState = localStorage.getItem("toggleState") || "Replace";
	document.getElementById("toggleState").value = storedState;
	document.querySelector(`input[name="action"][value="${storedState}"]`).checked = true;
});

document.querySelectorAll('input[name="action"]').forEach((elem) => {
	elem.addEventListener("change", function () {
		localStorage.setItem("toggleState", this.value);
		document.getElementById("toggleState").value = this.value;
	});
});

// Function to access the setting info
function getToggleState() {
	return localStorage.getItem("toggleState") || document.getElementById("toggleState").value;
}

// Function to set the replace state
function setReplaceState(state) {
	localStorage.setItem("toggleState", state);
	document.getElementById("toggleState").value = state;
}
