// Default settings
const defaultSettings = {
	action: "replace", // 'replace' or 'delete'
	filterWords: "",
	hideAuthors: false // New setting for hiding authors
}

function setReplaceState(state) {
	if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
		chrome.storage.sync.set({ toggleState: state })
	} else {
		localStorage.setItem("toggleState", state)
	}
}

const getToggleState = (callback) => {
	if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
		chrome.storage.sync.get(["toggleState", "filterWords", "hideAuthors"], (result) => {
			const state = result.toggleState || defaultSettings.action
			const filterWords = result.filterWords || defaultSettings.filterWords
			const hideAuthors = result.hideAuthors || defaultSettings.hideAuthors
			callback(state, filterWords, hideAuthors)
		})
	} else {
		const state = localStorage.getItem("toggleState") || defaultSettings.action
		const filterWords = localStorage.getItem("filterWords") || defaultSettings.filterWords
		const hideAuthors = localStorage.getItem("hideAuthors") || defaultSettings.hideAuthors
		callback(state, filterWords, hideAuthors)
	}
}

getToggleState((state, filterWords, hideAuthors) => {
	// Initial processing of existing articles
	const initialArticles = document.querySelectorAll("article")
	processArticles(initialArticles, filterWords, hideAuthors)

	// Set up a MutationObserver to monitor changes in the DOM
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					const newArticles =
						node.tagName === "ARTICLE"
							? [node]
							: node.querySelectorAll("article")
					if (newArticles.length) {
						processArticles(newArticles, filterWords, hideAuthors)
					}
				}
			})
		})
	})

	// Start observing the document body for added nodes and subtree modifications
	observer.observe(document.body, { childList: true, subtree: true })

	// Periodically check for new articles to cover any edge cases
	setInterval(() => {
		const newArticles = document.querySelectorAll(
			"article:not([data-processed])"
		)
		newArticles.forEach((article) => {
			article.setAttribute("data-processed", "true")
		})
		processArticles(newArticles, filterWords, hideAuthors)
	}, 5000)
})

// Function to process articles
function processArticles(articles, filterWords, hideAuthors) {
	if (!filterWords.trim()) return

	const filters = filterWords
		.split(",")
		.map((word) => word.trim().toLowerCase())
	articles.forEach((article) => {
		const aspectRatioTag = article.querySelector("shreddit-aspect-ratio")

		// Check if the article contains any of the filter words (case-insensitive)
		const articleText = article.textContent.toLowerCase()
		const containsFilterWord = filters.some((filter) =>
			articleText.includes(filter)
		)
		if (containsFilterWord) {
			getToggleState((state) => {
				if (state.toLowerCase() === "delete") {
					article.remove()
					return
				}
				if (aspectRatioTag) {
					const img = document.createElement("img")
					const imgSrc = chrome.runtime.getURL("images/image.png")
					img.src = imgSrc
					img.onload = () => {}
					img.onerror = (e) => {}
					aspectRatioTag.replaceWith(img)
				}

				// Find and replace images in elements with class "block w-100 h-100"
				const blockImages = article.querySelectorAll(".block.w-100.h-100 img")
				blockImages.forEach((img) => {
					const parentLink = img.closest("a")
					if (parentLink) {
						parentLink.replaceWith(img)
					}
					const imgSrc = chrome.runtime.getURL("images/image.png")
					img.src = imgSrc
					img.onload = () => {}
					img.onerror = (e) => {}
				})

				// Replace the second <a> tag's text with "cute kitten"
				const links = article.querySelectorAll("a")
				if (links.length > 1) {
					links[2].textContent = "cute kitten" // Place holder for now!
					if (hideAuthors) {
						links[1].textContent = "No one interesting"
					}
				}
			})
		}
	})
}
