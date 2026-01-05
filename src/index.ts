import { makeElement, createButton } from "./modules/utils";
import { initializeApp } from "./main";
import { getUserRole } from "./firebase/authService";
import { auth } from "./firebase/firebase";
import { navigateTo } from "./modules/navigate";

const pageWrapper = document.getElementById('page-wrapper') as HTMLElement;
const loading = document.getElementById('loading');

async function updateUIbasedOnAuth(userRole: string | null) {
  const mainElement = document.createElement('main');
  const buttonGroup = makeElement('section', 'options', 'button-group-column', null);
  if (userRole === "admin") {
    const startNewInspection = createButton("Start New Inspection", "button", "new-inspection", "large full button green");
    startNewInspection.addEventListener('click', () => navigateTo('/selectHive'));
    buttonGroup.appendChild(startNewInspection);
    const manageHives = createButton("Manage Hives", "button", "manage-hives", "large full button purple");
    manageHives.addEventListener('click', () => navigateTo("/hives/"));
    buttonGroup.appendChild(manageHives);
  }
  const viewPastInspections = createButton("Past Inspections", "button", "past-inspections", "large full button orange");
  viewPastInspections.addEventListener('click', () => navigateTo('/past/'));
  buttonGroup.appendChild(viewPastInspections);
  const search = createButton("Search", "button", "search-button", "large full button blue");
  search.addEventListener('click', () => navigateTo('/search'));
  buttonGroup.appendChild(search)
  mainElement.appendChild(buttonGroup);
  const oldMain = pageWrapper.querySelector('main') as HTMLElement;
  pageWrapper.replaceChild(mainElement, oldMain);
  if (loading) loading.classList.add('hide');
  mainElement.classList.remove('hide');
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

