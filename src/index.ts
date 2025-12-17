import { makeElement, createLink } from "./modules/utils";
import { initializeApp } from "./main";
import { getUserRole } from "./firebase/authService";
import { auth } from "./firebase/firebase";

const pageWrapper = document.getElementById('page-wrapper') as HTMLElement;
const loading = document.getElementById('loading');

async function updateUIbasedOnAuth(userRole: string | null) {
    const mainElement = document.createElement('main');
    const buttonGroup = makeElement('section', 'options', 'button-group-column', null);
    if (userRole === "admin") {
        // const startNewInspection = createLink("Start New Inspection", "/hives-selector", false, 'large full button green', null)
        const startNewInspection = createLink("Start New Inspection (Coming Soon)", "#", false, 'large full button grey', null);
        buttonGroup.appendChild(startNewInspection);
        // const manageHives = createLink("Manage Hives", '/manage-hive', false, 'large full button purple', null);
        const manageHives = createLink("Manage Hives (Coming Soon)", '#', false, 'large full button grey', null);
        buttonGroup.appendChild(manageHives);
    }
    const viewPastInspections = createLink("View Past Inspections", "/past/", false, 'large full button orange', null)
    buttonGroup.appendChild(viewPastInspections);
    const search = createLink("Search", "/search", false, "large full button blue", null);
    buttonGroup.appendChild(search)
    mainElement.appendChild(buttonGroup);
    const oldMain = pageWrapper.querySelector('main') as HTMLElement;
    pageWrapper.replaceChild(mainElement, oldMain);
    if (loading) loading.classList.add('hide');
}

initializeApp("").then(async () => {
    auth.onAuthStateChanged(async (user) => {
    let userRole: string | null = null;
    if (user) {
      userRole = await getUserRole(user.uid);
    }
    updateUIbasedOnAuth(userRole);
  });
})

