/**
 * Copy text to clipboard with automatic fallback for non-secure contexts (e.g. HTTP, LAN IPs).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API if supported and in a secure context
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function" &&
    (window.isSecureContext || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to textarea execCommand fallback
    }
  }

  // Fallback for non-secure context (e.g. accessing via http://<lan-ip>:8080 or older browsers)
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Prevent scrolling and keep off-screen
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.style.opacity = "0";
    textArea.setAttribute("readonly", "");

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Clipboard copy failed:", err);
    return false;
  }
}
