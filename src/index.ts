import { createButton } from "./modules/utils";

export function loadIndex(userRole: string | null) {
    const mainElement = document.createElement('main');
    const buttonGroup = document.createElement('section');
    buttonGroup.setAttribute('class', 'button-group-column');
    if (userRole === "admin") {
        const startNewInspection = createButton("Start New Inspection", "button", "start-inspection", 'large full button green');
        buttonGroup.appendChild(startNewInspection);
        const manageHives = createButton("Manage Hives", 'button', 'manage-hives', 'large full button purple');
        buttonGroup.appendChild(manageHives);
    }
    const viewPastInspections = createButton("View Past Inspections", 'button', 'view-past', 'large full button orange');
    buttonGroup.appendChild(viewPastInspections);
    const search = createButton("Search", 'button', 'search', 'large full button blue');
    buttonGroup.appendChild(search)
    mainElement.appendChild(buttonGroup);
    return mainElement;
}