const API_BASE_URL = "http://localhost:8000";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "LOOKUP_DOMAIN") {
    lookupDomain(message.domain)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Records are keyed by origin (e.g. "https://twitter.com/"). Try the exact
// origin first, then fall back to the bare domain for "www." hosts.
async function lookupDomain(domain) {
  const body = await fetchRecords(domain);
  if (body.data.length === 0 && domain.includes("://www.")) {
    return fetchRecords(domain.replace("://www.", "://"));
  }
  return body;
}

async function fetchRecords(domain) {
  const url = `${API_BASE_URL}/api/records?url=${encodeURIComponent(domain)}&limit=1`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API returned status ${response.status}`);
  }

  const body = await response.json();

  if (!body.success) {
    throw new Error(body.error || "API request failed");
  }

  return body;
}
