document.addEventListener("DOMContentLoaded", init);

const RIGHTS_META = {
  rtk: { label: "Right to Know" },
  rtd: { label: "Right to Delete" },
  rto: { label: "Right to Opt-Out" },
};

function init() {
  document.getElementById("btn-retry").addEventListener("click", performLookup);
  performLookup();
}

async function performLookup() {
  showState("loading");

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.url) {
      showError("Cannot access this tab's URL.");
      return;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(tab.url);
    } catch {
      showError("This page does not have a valid URL.");
      return;
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      document.getElementById("domain-display").textContent = "N/A";
      showNotFound();
      return;
    }

    const domain = parsedUrl.origin + "/";
    document.getElementById("domain-display").textContent = parsedUrl.hostname;

    const response = await chrome.runtime.sendMessage({
      type: "LOOKUP_DOMAIN",
      domain: domain,
    });

    if (!response || !response.success) {
      showError(
        response?.error || "Failed to fetch data. Is the API running?"
      );
      return;
    }

    const records = response.data?.data;
    if (!records || records.length === 0) {
      showNotFound();
      return;
    }

    renderResult(records[0]);
  } catch {
    showError("Could not connect to the CCPA Helper API. Is it running?");
  }
}

function showState(state) {
  ["loading", "error", "not-found", "result"].forEach((s) => {
    const el = document.getElementById(`state-${s}`);
    if (el) el.classList.toggle("state--hidden", s !== state);
  });
}

function showError(message) {
  document.getElementById("error-message").textContent = message;
  showState("error");
}

function showNotFound() {
  showState("not-found");
}

function renderResult(record) {
  document.getElementById("company-name").textContent = record.company;

  const badge = document.getElementById("ccpa-badge");
  badge.textContent = record.CCPA ? "CCPA Compliant" : "Not Compliant";
  badge.className = `badge ${record.CCPA ? "badge--success" : "badge--danger"}`;

  const rightsList = document.getElementById("rights-list");
  rightsList.innerHTML = "";

  for (const [key, meta] of Object.entries(RIGHTS_META)) {
    const right = record[key];
    const exists = right?.exists ?? false;
    const mechanism = right?.mechanism || null;
    const url = right?.url || null;

    const card = document.createElement("div");
    card.className = "right-card";

    const header = document.createElement("div");
    header.className = "right-card__header";

    const indicator = document.createElement("span");
    indicator.className = `right-card__indicator ${exists ? "right-card__indicator--yes" : "right-card__indicator--no"}`;
    indicator.innerHTML = exists ? "&#10003;" : "&#10005;";

    const label = document.createElement("span");
    label.className = "right-card__label";
    label.textContent = meta.label;

    header.appendChild(indicator);
    header.appendChild(label);

    if (mechanism) {
      const mech = document.createElement("span");
      mech.className = "right-card__mechanism";
      mech.textContent = mechanism;
      header.appendChild(mech);
    }

    card.appendChild(header);

    if (exists && url) {
      const link = document.createElement("a");
      link.className = "right-card__link";
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Exercise this right \u2192";
      card.appendChild(link);
    }

    rightsList.appendChild(card);
  }

  const policyLink = document.getElementById("policy-link");
  if (record.policyURL) {
    policyLink.href = record.policyURL;
    policyLink.style.display = "";
  } else {
    policyLink.style.display = "none";
  }

  const dateEl = document.getElementById("policy-date");
  if (record.dateOfPolicy) {
    const date = new Date(record.dateOfPolicy);
    dateEl.textContent = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } else {
    dateEl.textContent = "";
  }

  showState("result");
}
