import { getBoxesForHiveID } from "./database/boxService";
import { initializeApp } from "./main";
import type { Box } from "./models";
import {
    createButton,
    makeElement,
    createCheckboxRow,
    createMessage
} from "./modules/utils";

let boxes: Box[] | null = null;

const boxSelectionSection = document.getElementById('box-selection') as HTMLElement;
const framesSection = document.getElementById('frames') as HTMLElement;
const loading = document.getElementById('loading') as HTMLElement;

function showBoxSelection() {
    if (boxes) {
        boxSelectionSection.innerHTML = '';
        const buttonGroup = boxes.reduce((acc: HTMLElement, currentBox: Box) => {
            const newButton = createButton(currentBox['box_name'], 'button', currentBox['box_id'].toString(), 'button white large full');
            newButton.addEventListener('click', () => {
                boxSelectionSection.classList.add('hide');
                showFramesSection(currentBox);
            })
            acc.appendChild(newButton);
            return acc;
        }, document.createElement('selection'));
        buttonGroup.setAttribute('class', 'button-group-column');
        boxSelectionSection.appendChild(buttonGroup);
        boxSelectionSection.classList.remove('hide');
    }
}

function showFramesSection(currentBox: Box) {
    // let frames: Frame[] = [];
    framesSection.classList.remove('hide');
    for (let i = 0; i < currentBox['num_frames']; i++) {
        framesSection.innerHTML = '';
        const frameForm = makeElement('form', 'frame-form', null, null);
        const sectionHeader = makeElement('h2', null, null, `Box: ${currentBox['box_name']} | Frame: ${i + 1}`);
        frameForm.appendChild(sectionHeader);
        const honeyDiv = createCheckboxRow("Honey");
        frameForm.appendChild(honeyDiv);
        const nectarDiv = createCheckboxRow("Nectar");
        frameForm.appendChild(nectarDiv);
        const broodDiv = createCheckboxRow("Brood");
        frameForm.appendChild(broodDiv);
        const queenCells = createCheckboxRow("Queen Cells");
        frameForm.appendChild(queenCells);
        const drawnComb = createCheckboxRow("Drawn Comb");
        frameForm.appendChild(drawnComb);
        const queenSpotted = createCheckboxRow("Queen Spotted");
        frameForm.appendChild(queenSpotted);
        framesSection.appendChild(frameForm);
        //TODO: add buttons to submit frame, skip to next box, and maybe previous frame
        //TODO: create function to validate frame and add to frames[] - Is there any validation needed?
    }
    //When all frames in box done, or clicked skip to next box, store all the frames in an object with box info
    //When all boxes done/skipped, store all data in session storage, send to end of inspection page
    //Don't submit anything to the database untill inspection is over
}

initializeApp("Frames").then(async () => {
    try {
        const hiveIdSessionStorage = sessionStorage.getItem('hiveId');
    if (hiveIdSessionStorage) {
        const hiveId = JSON.parse(hiveIdSessionStorage);
        boxes = await getBoxesForHiveID(hiveId, true);
        showBoxSelection();
    } else {
        throw new Error(`No hive ID found, please go back home and try again.`)
    }
    loading.classList.add('hide');
    } catch (error: any) {
        loading.classList.add('hide');
        createMessage(error, 'main-message', 'error');
    }
})