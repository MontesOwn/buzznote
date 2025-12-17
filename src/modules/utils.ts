import { AverageDetail, Frame, Inspection, InspectionListItem } from "../models";

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

export function createTableHead(columnHeaders: string[]) {
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

type TableItem = InspectionListItem | AverageDetail | Frame | {};

export function createRowForListTable(item: TableItem, columnHeaders: string[], itemId: string) {
  const newRow = document.createElement('tr');
  newRow.setAttribute('id', itemId);
  for (const key of columnHeaders) {
    const newCell = document.createElement("td");
    const itemValue = (item as any)[key];
    const valueString = document.createTextNode(itemValue?.toString() || "");
    newCell.appendChild(valueString);
    newRow.appendChild(newCell);
  }
  return newRow;
}

export function createListTable(itemsArray: InspectionListItem[] | AverageDetail[] | Frame[], columnHeaders: string[], primaryIdKeyName: string) {
  const table = makeElement("table", null, null, null);
  const tableHead = createTableHead(columnHeaders);
  table.appendChild(tableHead);
  const tableBody = itemsArray.reduce((acc: HTMLElement, currentItem: InspectionListItem | AverageDetail | Frame) => {
    const itemId = (currentItem as any)[primaryIdKeyName]?.toString() || "";
    const newRow = createRowForListTable(currentItem, columnHeaders, itemId);
    acc.appendChild(newRow);
    return acc;
  }, document.createElement('tbody'));
  table.appendChild(tableBody);
  return table;
}

export function createItemTable(item: Inspection | AverageDetail, columnHeaders: string[], primaryIdKeyName: string) {
  const table = makeElement("table", null, null, null);
  const tableHead = createTableHead(columnHeaders);
  table.appendChild(tableHead);
  const tableBody = document.createElement('tbody');
  const newRow = columnHeaders.reduce((acc: HTMLElement, key: string) => {
    const newCell = document.createElement('td');
    if (primaryIdKeyName === "inspection_id") {
      const inspectionItem = item as Inspection;
      if (key === "weather") {
        const weather = document.createTextNode(`${inspectionItem['weather_temp']}°F ${inspectionItem['weather_condition']}`);
        newCell.appendChild(weather);
      } else if (key === "brood") {
        const broodArray = [];
        if (inspectionItem['brood_eggs']) broodArray.push("Eggs");
        if (inspectionItem['brood_larva']) broodArray.push("Larva");
        if (inspectionItem['brood_capped']) broodArray.push("Capped");
        newCell.innerHTML = broodArray.join("<br/>");
      } else {
        const itemValue = (item as any)[key];
        const valueString = document.createTextNode(itemValue?.toString() || "");
        newCell.appendChild(valueString);
      }
    } else if (key === "expand") {
      const expandButton = createButton("expand_all", 'button', `expand-${primaryIdKeyName}`, 'material-symbols-outlined');
      newCell.appendChild(expandButton);
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

export function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function createInput(inputType: string, name: string, labelText: string | null) {
  const newInput = makeElement("input", name, null, null);
  newInput.setAttribute("type", inputType);
  newInput.setAttribute("name", name);
  if (labelText) {
    const containerDiv = makeElement("div", null, "input-and-label", null);
    const label = document.createElement('label');
    label.setAttribute("for", name);
    containerDiv.appendChild(label);
    containerDiv.appendChild(newInput);
    return containerDiv;
  } else {
    return newInput
  }
}

export function storeInspectionIds(inspectionList: InspectionListItem[]) {
  const inspectionIds: number[] = inspectionList.reduce((acc: number[], currentInspection: InspectionListItem) => {
    acc.push(currentInspection['inspection_id']);
    return acc;
  }, []);
  sessionStorage.setItem("inspectionIds", JSON.stringify(inspectionIds));
}