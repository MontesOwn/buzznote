import { Average, Inspection, InspectionListItem } from "../models";

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

export function createLink(linkText: string, linkHref: string, external: boolean, linkClass: string | null, icon: string | null) {
  const newLink = document.createElement('a');
  newLink.setAttribute('href', linkHref);
  if (external) {
    newLink.setAttribute('target', '_blank');
  }
  if (linkClass) {
    newLink.setAttribute('class', linkClass);
  }
  if (icon) {
    const buttonIconSpan = document.createElement("span");
    buttonIconSpan.setAttribute("class", "material-symbols-outlined");
    const linkIcon = document.createTextNode(icon);
    buttonIconSpan.appendChild(linkIcon);
    newLink.appendChild(linkIcon);
  }
  newLink.textContent = linkText;
  return newLink;
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

export function makeElement(elementType: string, elementId: string | null, elementClass: string | null, elementText: string | null) {
  const newElement = document.createElement(elementType);
  if (elementId) newElement.setAttribute('id', elementId);
  if (elementClass) {
    newElement.setAttribute('class', elementClass);
  }
  if (elementText) newElement.textContent = elementText;
  return newElement;
}

export function createCheckboxRow(checkboxName: string) {
  const idName = checkboxName.toLowerCase().replace(" ", "-");
  const checkboxContainer = document.createElement('div');
  const divH3 = makeElement('h3', null, 'center', checkboxName);
  checkboxContainer.appendChild(divH3);
  const buttonRow = makeElement("div", `${checkboxName}-checkboxes`, 'button-group-row', null);
  const checkLabelA = document.createElement('label');
  checkLabelA.setAttribute('for', `${idName}-a`);
  checkLabelA.setAttribute('class', 'button full red');
  checkLabelA.textContent = "Side A";
  buttonRow.appendChild(checkLabelA);
  const checkboxA = document.createElement('input') as HTMLInputElement;
  checkboxA.setAttribute('type', 'checkbox');
  checkboxA.setAttribute('id', `${idName}-a`);
  checkboxA.setAttribute('name', `${idName}-a`);
  checkboxA.addEventListener('change', (e) => {
    const isChecked = (e.target as HTMLInputElement).checked;
    if (isChecked) {
      checkLabelA.classList.remove('red');
      checkLabelA.classList.add('green');
    } else {
      checkLabelA.classList.remove('green');
      checkLabelA.classList.add('red');
    }
  });
  buttonRow.appendChild(checkboxA);

  const checkLabelB = document.createElement('label');
  checkLabelB.setAttribute('for', `${idName}-b`);
  checkLabelB.setAttribute('class', 'button full red');
  checkLabelB.textContent = "Side B";
  buttonRow.appendChild(checkLabelB);
  const checkboxB = document.createElement('input') as HTMLInputElement;
  checkboxB.setAttribute('type', 'checkbox');
  checkboxB.setAttribute('id', `${idName}-b`);
  checkboxB.setAttribute('name', `${idName}-b`);
  checkboxB.addEventListener('change', (e) => {
    const isChecked = (e.target as HTMLInputElement).checked;
    if (isChecked) {
      checkLabelB.classList.remove('red');
      checkLabelB.classList.add('green');
    } else {
      checkLabelB.classList.remove('green');
      checkLabelB.classList.add('red');
    }
  });
  buttonRow.appendChild(checkboxB);
  checkboxContainer.appendChild(buttonRow);
  return checkboxContainer;
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

export function getFormattedDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getStartTime() {
  const today = new Date();
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function createTableHead(columnHeaders: string[]) {
  const tableHead = columnHeaders.reduce(
    (acc: HTMLElement, currentColumnHeader: string) => {
      const newColumnHeader = document.createElement("th");
      const readableKey = currentColumnHeader.split('_')
        .map(word => {
          if (word.length === 0) return '';
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
      const columnHeaderName = document.createTextNode(readableKey);
      newColumnHeader.appendChild(columnHeaderName);
      acc.appendChild(newColumnHeader);
      return acc;
    }, document.createElement("thead"));
  return tableHead;
}

export function createListTable(itemsArray: InspectionListItem[], columnHeaders: string[]) {
  const table = makeElement("table", null, "table table-striped table-hover", null);
  const tableHead = createTableHead(columnHeaders);
  table.appendChild(tableHead);
  const tableBody = itemsArray.reduce((acc: HTMLElement, currentItem: InspectionListItem) => {
    const newRow = document.createElement('tr');
    newRow.setAttribute('id', currentItem['inspection_id'].toString());
    for (const key of columnHeaders) {
      const newCell = document.createElement("td");
      const itemValue = (currentItem as any)[key];
      const valueString = document.createTextNode(itemValue?.toString() || "");
      newCell.appendChild(valueString);
      newRow.appendChild(newCell);
    }
    acc.appendChild(newRow);
    return acc;
  }, document.createElement('tbody'));
  table.appendChild(tableBody);
  return table;
}

export function createItemTable(item: Inspection, columnHeaders: string[]) {
  const table = makeElement("table", null, "table table-striped table-hover", null);
  const tableHead = createTableHead(columnHeaders);
  table.appendChild(tableHead);
  const tableBody = document.createElement('tbody');
  const newRow = columnHeaders.reduce((acc: HTMLElement, key: string) => {
    const newCell = document.createElement('td');
    if (key === "weather") {
      const weather = document.createTextNode(`${item['weather_temp']}°F ${item['weather_condition']}`);
      newCell.appendChild(weather);
    } else if (key === "brood") {
      const broodArray = [];
      if (item['brood_eggs']) broodArray.push("Eggs");
      if (item['brood_larva']) broodArray.push("Larva");
      if (item['brood_capped']) broodArray.push("Capped");
      newCell.innerHTML = broodArray.join("<br/>");
    } else {
      const itemValue = (item as any)[key];
      const valueString = document.createTextNode(itemValue?.toString() || "");
      newCell.appendChild(valueString);
    }
    acc.appendChild(newCell);
    return acc;
  }, document.createElement('tr'));
  tableBody.appendChild(newRow);
  table.appendChild(tableBody);
  return table;
}