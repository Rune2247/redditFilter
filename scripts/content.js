// Default settings
const defaultSettings = {
	action: "replace" // 'replace' or 'delete'
}

function setReplaceState(state) {
	localStorage.setItem("toggleState", state)
}

const getToggleState = () => {
	const state = localStorage.getItem("toggleState")
	if (state === null) {
		setReplaceState(defaultSettings.action)
		return defaultSettings.action
	}
	return state
}

console.log(getToggleState())

// Function to process articles
function processArticles(articles) {
	articles.forEach((article) => {
		console.log("Processing article:", article)
		const aspectRatioTag = article.querySelector("shreddit-aspect-ratio")

		// Check if the article contains the word "Trump" (case-insensitive)
		if (article.textContent.toLowerCase().includes("trump")) {
			if (getToggleState() === "delete") {
				article.remove()
				return
			}
			console.log("The article contains the word 'Trump':", article)
			if (aspectRatioTag) {
				console.log("Aspect ratio tag found:", aspectRatioTag)
				const img = document.createElement("img")
				const imgSrc = chrome.runtime.getURL("images/image.png")
				console.log("Image source URL:", imgSrc)
				img.src = imgSrc
				img.onload = () => console.log("Image loaded successfully")
				img.onerror = (e) => console.error("Error loading image", e, imgSrc)
				aspectRatioTag.replaceWith(img)
				console.log("Image replaced:", img)
			} else {
				console.log("Aspect ratio tag not found in article:", article)
			}

			// Find and replace images in elements with class "block w-100 h-100"
			const blockImages = article.querySelectorAll(".block.w-100.h-100 img")
			blockImages.forEach((img) => {
				const parentLink = img.closest("a")
				if (parentLink) {
					parentLink.replaceWith(img)
				}
				const imgSrc = chrome.runtime.getURL("images/image.png")
				console.log("Image source URL:", imgSrc)
				img.src = imgSrc
				img.onload = () => console.log("Image loaded successfully")
				img.onerror = (e) => console.error("Error loading image", e, imgSrc)
				console.log("Image replaced:", img)
			})
		}

		console.log("Finished processing article:", article)
	})
}

// Initial processing of existing articles
const initialArticles = document.querySelectorAll("article")
processArticles(initialArticles)

// Set up a MutationObserver to monitor changes in the DOM
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		mutation.addedNodes.forEach((node) => {
			if (node.nodeType === Node.ELEMENT_NODE) {
				const newArticles =
					node.tagName === "ARTICLE" ? [node] : node.querySelectorAll("article")
				if (newArticles.length) {
					processArticles(newArticles)
				}
			}
		})
	})
})

// Start observing the document body for added nodes and subtree modifications
observer.observe(document.body, { childList: true, subtree: true })

// Periodically check for new articles to cover any edge cases
setInterval(() => {
	const newArticles = document.querySelectorAll("article:not([data-processed])")
	newArticles.forEach((article) => {
		article.setAttribute("data-processed", "true")
	})
	processArticles(newArticles)
}, 5000)
