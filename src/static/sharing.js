export function getSharedActivityName() {
  return new URLSearchParams(window.location.hash.slice(1)).get("activity");
}

export function addSharingControls(card, name) {
  const url = new URL(window.location.pathname, window.location.origin);
  url.hash = new URLSearchParams({ activity: name }).toString();
  const text = `Join me for ${name} at Mergington High School!`;

  const controls = document.createElement("div");
  controls.className = "activity-sharing";
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", `Share ${name}`);

  const destinations = [
    ["WhatsApp", "https://wa.me/", { text: `${text} ${url.href}` }],
    ["Facebook", "https://www.facebook.com/sharer/sharer.php", { u: url.href }],
    ["X", "https://twitter.com/intent/tweet", { text, url: url.href }],
  ];

  destinations.forEach(([label, destination, parameters]) => {
    const link = document.createElement("a");
    const shareUrl = new URL(destination);
    shareUrl.search = new URLSearchParams(parameters).toString();
    link.href = shareUrl.href;
    link.textContent = label;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Share ${name} on ${label} (opens a new tab)`);
    controls.appendChild(link);
  });

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.textContent = "Copy link";
  copyButton.setAttribute("aria-label", `Copy link to ${name}`);

  const manualLink = document.createElement("input");
  manualLink.type = "text";
  manualLink.readOnly = true;
  manualLink.value = url.href;
  manualLink.className = "share-link hidden";
  manualLink.setAttribute("aria-label", `Link to ${name}`);

  const status = document.createElement("p");
  status.className = "share-status";
  status.setAttribute("role", "status");

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url.href);
      manualLink.classList.add("hidden");
      status.textContent = "Link copied!";
    } catch {
      manualLink.classList.remove("hidden");
      manualLink.focus();
      manualLink.select();
      status.textContent = "Copy the selected link to share this activity.";
    }
  });

  controls.append(copyButton, manualLink, status);
  card.appendChild(controls);
}
