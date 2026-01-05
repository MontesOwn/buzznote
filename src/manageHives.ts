import { initializeApp } from "./main";
import { closeModal, createButton, createCheckbox, createInput, createListTable, createMessage, createRowForListTable, makeElement, openModal } from "./modules/utils";
import { addNewHive, getAllHives } from "./services/hiveService";
import { Hive } from "./models";
import { auth } from "./firebase/firebase";
import { getUserRole } from "./firebase/authService";
import { navigateTo } from "./modules/navigate";

const loading = document.getElementById("loading") as HTMLHtmlElement;
const mainElement = document.querySelector('main') as HTMLElement;
const backButton = document.getElementById("back-button") as HTMLElement;

initializeApp("Manage Hives").then(async () => {
    try {
        backButton.addEventListener('click', () => navigateTo('/'));
        const hives: Hive[] = await getAllHives(false);
        const pageHeading = makeElement("h2", null, null, "Selecte a hive to manage:");
        mainElement.appendChild(pageHeading);
        const columnHeaders = ['hive_name', 'num_boxes', 'active'];
        const hivesTable = createListTable(hives, columnHeaders, 'hive_id');
        hivesTable.setAttribute('id', 'hives-table');
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userRole = await getUserRole(user.uid);
                if (userRole === "admin") {
                    hivesTable.classList.add('table-clickable');
                    const rows = hivesTable.querySelectorAll('tr');
                    rows.forEach(row => {
                        row.addEventListener('click', () => {
                            window.location.href = `/hives/manage?hiveId=${row.id}`;
                        });
                    });
                    mainElement.appendChild(hivesTable);
                    const openAddModal = createButton("Add Hive", "button", "open-add-modal", "button blue", "add");
                    openAddModal.addEventListener('click', () => {
                        showAddHivesModal();
                    });
                    mainElement.appendChild(openAddModal);
                } else {
                    hivesTable.classList.remove('table-clickable');
                    mainElement.appendChild(hivesTable);
                }
            }
            loading.remove();
            mainElement.classList.remove('hide');
        });
    } catch (error: any) {
        createMessage(error, 'main-message', 'error');
    }
});

async function addHive(formData: FormData) {
    try {
        let newHive: Hive = {
            hive_id: 0,
            hive_name: "",
            num_boxes: 0,
            active: false
        }
        const newHiveName = formData.get('hive-name-input');
        if (newHiveName === null || newHiveName.toString().trim() === "") {
            createMessage("Please enter a name for the new hive", "add-hive-message", "error");
            return;
        } else {
            newHive['hive_name'] = newHiveName.toString();
        }
        const status = formData.get('status-checkbox') !== null;
        if (status) {
            newHive['active'] = status;
        }
        const response = await addNewHive(newHive);
        newHive['hive_id'] = parseInt(response['hive_id']);
        const columnHeaders = ['hive_name', 'num_boxes', 'active'];
        const newHiveRow = createRowForListTable(newHive, columnHeaders, newHive['hive_id'].toString());
        const hivesTable = document.getElementById('hives-table');
        if (hivesTable) {
            const tbody = hivesTable.querySelector('tbody') as HTMLElement;
            tbody.appendChild(newHiveRow);
            createMessage(response['message'], "main-message", "check_circle");
            newHiveRow.addEventListener('click', () => navigateTo("/hives/manage", {params: {hiveId: newHiveRow.id}}));
        } else {
            throw new Error("Could not reload hives. Please try refreshing the page");
        }
    } catch (error: any) {
        createMessage(error, "main-message", "error");
    }
    closeModal('add-hive-backdrop');
}

async function showAddHivesModal() {
    const addHiveModalBackdrop = document.getElementById('add-hive-backdrop') as HTMLElement;
    const addHiveModal = document.getElementById('add-hive-modal') as HTMLFormElement;
    addHiveModal.innerHTML = '';
    const formTitle = makeElement("h2", null, null, "Enter the details for the new hive");
    addHiveModal.appendChild(formTitle);
    const hiveNameInput = createInput("text", "hive-name-input", "Hive Name:", "form-row");
    addHiveModal.appendChild(hiveNameInput);
    const checkboxRow = makeElement("section", null, "form-row", null);
    const statusP = makeElement("p", null, null, "status:");
    checkboxRow.appendChild(statusP);
    const statusCheckbox = createCheckbox("Active", "Not Active", "status-checkbox", false, false);
    checkboxRow.appendChild(statusCheckbox);
    addHiveModal.appendChild(checkboxRow);
    const actionButtonRow = makeElement("section", null, "button-group-row", null);
    const closeButton = createButton("Close", "button", "close-button", "button red");
    closeButton.addEventListener('click', () => closeModal('add-hive-backdrop'));
    actionButtonRow.appendChild(closeButton);
    const submitButton = createButton("Submit", "submit", "submit-button", "button green");
    actionButtonRow.appendChild(submitButton);
    addHiveModal.appendChild(actionButtonRow);
    addHiveModal.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(addHiveModal);
        addHive(formData);
    });
    openModal(addHiveModalBackdrop, addHiveModal, 'hive-name-input');
}