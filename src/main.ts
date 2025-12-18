import { closeModal, createMessage, makeElement } from "./modules/utils";
import {
  signInWithGooglePopup,
  signOutUser,
} from "./firebase/authService";
import { auth } from "./firebase/firebase";

const signInButton = document.getElementById('sign-in') as HTMLElement;
const signOutButton = document.getElementById('sign-out') as HTMLElement;
const headerTitle = document.getElementById('header-title') as HTMLElement;
const accountContainer = document.getElementById('account-container') as HTMLElement;

function setUpAuthListener() {
  auth.onAuthStateChanged((user) => {
    const usernameP = accountContainer.querySelector('p');
    if (user) {
      //User is signed in
      //Hide the sign in button and show the sign out button
      signInButton.classList.add('hide');
      signOutButton.classList.remove('hide');
      //Set the username
      if (usernameP) {
        usernameP.textContent = `${user.displayName} |`;
      } else {
        const username = makeElement('p', 'username', null, `${user.displayName} |`);
        accountContainer.prepend(username);
      }
    } else {
      //User is not signed in
      //Make sure the sign in button is displayed and the sign out button is not displayed
      if (usernameP) usernameP.remove();
      signInButton.classList.remove('hide');
      signOutButton.classList.add('hide');
    }
  });
}

export async function initializeApp(currentPage: string) {
  if (currentPage !== "") {
    //Set the page title
    document.title = `${currentPage} - Buzznote`;
  }
  //Wait for the DOM to load
  await new Promise<void>(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
    } else {
      resolve();
    }
  });
  setUpAuthListener();

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

  headerTitle.addEventListener('click', () => window.location.href = '/');

  //event listener for the user to press escape to close any modal that is open
  document.addEventListener("keydown", (e) => {
    let addHiveModalBackdrop = document.getElementById("add-hive-backdrop");
    let manageHiveBackdrop = document.getElementById("manage-hive-backdrop");
    let notesModalBackdrop = document.getElementById("notes-backdrop");
    if (e.key === "Escape") {
      e.preventDefault();
      if (
        addHiveModalBackdrop &&
        !addHiveModalBackdrop.classList.contains('hide')
      ) {
        closeModal("add-hive-backdrop");
      } else if (manageHiveBackdrop &&
        !manageHiveBackdrop.classList.contains('hide')
      ) {
        closeModal("manage-hive-backdrop");
      } else if (notesModalBackdrop && !notesModalBackdrop.classList.contains('hide')) {
        closeModal("notes-backdrop");
      } else {
        console.warn("Esc key pressed, but no modals are open");
      }
    }
  });
}