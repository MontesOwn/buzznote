export function createButton(
  buttonText: string,
  buttonType: string,
  buttonId: string,
  buttonClass: string,
  icon?: string,
): HTMLElement {
  const newButton = document.createElement("button");
  newButton.setAttribute("type", buttonType);
  newButton.setAttribute("id", buttonId);
  newButton.setAttribute("class", buttonClass);
  if (icon) {
    const buttonIconSpan = document.createElement("span");
    buttonIconSpan.setAttribute("class", "material-symbols-outlined");
    const buttonIcon = document.createTextNode(icon);
    buttonIconSpan.appendChild(buttonIcon);
    newButton.appendChild(buttonIconSpan);
  }
  const buttonTextElm = document.createTextNode(buttonText);
  newButton.appendChild(buttonTextElm);
  return newButton;
}

export function createMessage(message: string, location: string, type: string) {
    clearMessages();
    const messageWrapper = document.getElementById(location) as HTMLElement;
    const messageDiv = document.createElement("div");
    if (type === "check_circle") {
        messageDiv.setAttribute("class", "success message");
        messageDiv.setAttribute("aria-live", "polite");
    } else if (type === "error") {
        messageDiv.setAttribute("class", "error message");
        messageDiv.setAttribute("role", "alert");
        console.error(message);
    } else if (type === "delete" || type === "warn") {
        messageDiv.setAttribute("class", "warn message");
        messageDiv.setAttribute("aria-live", "polite");
        console.warn(message);
    } else {
        messageDiv.setAttribute("class", "info message");
        messageDiv.setAttribute("aria-live", "polite");
    }
    const icon = document.createElement("span");
    icon.setAttribute("class", "material-symbols-outlined");
    const iconName = document.createTextNode(type);
    icon.appendChild(iconName);
    messageDiv.appendChild(icon);
    const messageText = document.createTextNode(message);
    messageDiv.appendChild(messageText);
    const closeButton = createButton("", "button", "closeButton", "", "close");
    closeButton.addEventListener("click", () => (messageWrapper.innerHTML = ""));
    messageDiv.appendChild(closeButton);
    messageWrapper.appendChild(messageDiv);
}

export function clearMessages() {
    const messageWrappers = document.getElementsByClassName("message-wrapper");
    for (const messageWrapper of messageWrappers) {
        messageWrapper.innerHTML = "";
    }
}

export function makeElement(elementType: string, elementText: string) {
    const newElement = document.createElement(elementType);
    newElement.textContent = elementText;
    return newElement;
}

export async function loadData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error Fetching ${url}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error(error);
  }
}