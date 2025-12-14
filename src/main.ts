import { createMessage, makeElement } from "./modules/utils";
import { loadIndex } from ".";
import {
  getUserRole,
  signInWithGooglePopup,
  signOutUser,
  type User
} from "./firebase/authService";
import { auth } from "./firebase/firebase";
import { startInspection } from "./start-inspection";

const pageWrapper = document.getElementById('page-wrapper') as HTMLElement;
const backButton = document.getElementById('back-button') as HTMLElement;
const signInButton = document.getElementById('sign-in') as HTMLElement;
const signOutButton = document.getElementById('sign-out') as HTMLElement;
const loading = document.getElementById('loading') as HTMLElement;

let currentPage = "";

function loadPage(userRole: string | null) {
  loading.classList.remove('hide');
  if (currentPage === "") {
    document.title = 'Buzznote';
    backButton.classList.add('hide');
  } else {
    backButton.classList.remove('hide');
    document.title = `${currentPage} - Buzznote`;
  }
  const oldMain = document.querySelector('main');
  if (oldMain) oldMain.remove();
  switch (currentPage) {
    case "start New Inspection":
      const startPage = startInspection();
      loading.classList.add('hide');
      pageWrapper.appendChild(startPage);
      backButton.addEventListener('click', () => {
        currentPage = "";
        sessionStorage.setItem('current-page', "");
        loadPage(userRole);
      });
      break;
    default:
      const indexPage = loadIndex(userRole);
      const startButton = indexPage.querySelector('#start-inspection');
      if (startButton) {
        startButton.addEventListener('click', () => {
          currentPage = "start New Inspection";
          sessionStorage.setItem('current-page', "start New Inspection");
          loadPage(userRole);
        });
      }
      loading.classList.add('hide');
      pageWrapper.appendChild(indexPage);
      break;
  }
}

async function startApp() {
  auth.onAuthStateChanged(async (user: User | null) => {
    let userRole: string | null = null;
    if (user) {
      //User is signed in
      //Hide the sign in button and show the sign out button
      if (user.displayName) {
        const accountContainer = document.getElementById('account-container') as HTMLElement;
        const username = makeElement('p', `${user.displayName} | `);
        accountContainer.prepend(username);
      }
      signInButton.classList.add('hide');
      signOutButton.classList.remove('hide');
      userRole = await getUserRole(user.uid);
    } else {
      //User is not signed in
      signInButton.classList.remove('hide');
      signOutButton.classList.add('hide');
    }
    const sessionPage = sessionStorage.getItem('current-page');
    if (sessionPage) currentPage = sessionPage;
    loadPage(userRole);
  });

  signInButton.addEventListener("click", async (e) => {
    e.preventDefault();
    createMessage("Opening Google window...", "main-message", "info");
    try {
      const result = await signInWithGooglePopup();
      //If sucessful sign in with Google, close the modal and display the message
      const user = result.user;
      if (user) {
        createMessage(
          `Welcome ${user.displayName}`,
          "main-message",
          "check_circle",
        );
      }
    } catch (error: any) {
      let errorMessage = "Sign-In failed.";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-In window closed.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Sign-In request already in progress.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      createMessage(errorMessage, "main-message", "error");
      console.error("Google sign-in error details:", error);
    }
  });

  //event listener to sign out
  signOutButton.addEventListener("click", () => {
    signOutUser();
  });
}

await startApp();