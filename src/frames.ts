import { getBoxesForHiveID } from "./services/boxService";
import { initializeApp } from "./main";
import { Average, Frame, FrameFormGroup, FramePair, type Box } from "./models";
import {
    createButton,
    makeElement,
    createCheckboxRow,
    createMessage
} from "./modules/utils";

let boxes: Box[] | null = null;

const mainElement = document.querySelector('main') as HTMLElement;
const boxSelectionSection = document.getElementById('box-selection') as HTMLElement;
const framesSection = document.getElementById('frames') as HTMLElement;
const loading = document.getElementById('loading') as HTMLElement;
const finishSection = document.getElementById('finish-section') as HTMLElement;
const finishButton = document.getElementById('finish-button') as HTMLElement;

let boxesWithFrames: FrameFormGroup[][] = [];

function createFramesArray(numFrames: number, boxId: number) {
    let framesForBox: FrameFormGroup[] = [];
    for (let i = 0; i < numFrames; i++) {
        const newFramePair = new FramePair(false, false);
        const newFrame = new FrameFormGroup(
            boxId,
            i + 1,
            newFramePair,
            newFramePair,
            newFramePair,
            newFramePair,
            newFramePair,
            newFramePair,
            false);
        framesForBox.push(newFrame);
    }
    return framesForBox;
}

function showBoxSelection() {
    if (boxes) {
        boxSelectionSection.innerHTML = '';
        const buttonGroup = boxes.reduce((acc: HTMLElement, currentBox: Box) => {
            const newButton = createButton(currentBox['box_name'], 'button', currentBox['box_id'].toString(), 'button white large full');
            newButton.addEventListener('click', () => {
                boxSelectionSection.classList.add('hide');
                finishSection.classList.add('hide');
                const frames = createFramesArray(currentBox['num_frames'], currentBox['box_id']);
                showFramesSection(frames, currentBox['box_name']);
            })
            acc.appendChild(newButton);
            return acc;
        }, document.createElement('selection'));
        buttonGroup.setAttribute('class', 'button-group-column');
        boxSelectionSection.appendChild(buttonGroup);
        boxSelectionSection.classList.remove('hide');
    }
}

function loadFrameForm(boxName: string, currentFrame: FrameFormGroup, index: number, numFrames: number) {
    const frameForm = makeElement('form', 'frame-form', null, null) as HTMLFormElement;
    const sectionHeader = makeElement('h2', null, null, `Box: ${boxName} | Frame: ${currentFrame['frame_number']}`);
    frameForm.appendChild(sectionHeader);
    const honeyDiv = createCheckboxRow("Honey", currentFrame['honey']);
    frameForm.appendChild(honeyDiv);
    const nectarDiv = createCheckboxRow("Nectar", currentFrame['nectar']);
    frameForm.appendChild(nectarDiv);
    const broodDiv = createCheckboxRow("Brood", currentFrame['brood']);
    frameForm.appendChild(broodDiv);
    const queenCells = createCheckboxRow("Queen Cells", currentFrame['queen_cells']);
    frameForm.appendChild(queenCells);
    const drawnComb = createCheckboxRow("Drawn Comb", currentFrame['drawn_comb']);
    frameForm.appendChild(drawnComb);
    const queenSpotted = createCheckboxRow("Queen Spotted", currentFrame['queen_spotted']);
    frameForm.appendChild(queenSpotted);
    framesSection.appendChild(frameForm);
    const actionRow = makeElement("section", "form-actions", "button-group-row", null);
    if (index > 0) {
        const previousButton = createButton("Previous Frame", "button", "previous-button", "button blue");
        actionRow.appendChild(previousButton);
    }
    if (index < numFrames - 1) {
        const nextButton = createButton("Next Frame", "button", "next-button", "button blue");
        actionRow.appendChild(nextButton);
    }
    const nextBox = createButton("Next Box", "button", "next-box-button", "button orange");
    actionRow.appendChild(nextBox);
    frameForm.appendChild(actionRow);
    return frameForm;

}

function convertFormDataToFrame(boxID: number, frameNumber: number, formData: FormData) {
    let honey: FramePair = new FramePair(false, false);
    const honeyA = formData.get('honey-a');
    if (honeyA) honey['sideA'] = true;
    const honeyB = formData.get('honey-b');
    if (honeyB) honey['sideB'] = true;
    let nectar: FramePair = new FramePair(false, false);
    const nectarA = formData.get('nectar-a');
    if (nectarA) nectar['sideA'] = true;
    const nectarB = formData.get('nectar-b');
    if (nectarB) nectar['sideB'] = true;
    let brood: FramePair = new FramePair(false, false);
    const broodA = formData.get("brood-a");
    if (broodA) brood['sideA'] = true;
    const broodB = formData.get('brood-b');
    if (broodB) brood['sideB'] = true;
    let queenSpotted: FramePair = new FramePair(false, false);
    const queenSpottedA = formData.get('queen_spotted-a');
    if (queenSpottedA) queenSpotted['sideA'] = true;
    const queenSpottedB = formData.get('queen_spotted-b');
    if (queenSpottedB) queenSpotted['sideB'] = true;
    let queenCells: FramePair = new FramePair(false, false);
    const queenCellsA = formData.get('queen_cells-a');
    if (queenCellsA) queenCells['sideA'] = true;
    const queenCellsB = formData.get('queen_cells-b');
    if (queenCellsB) queenCells['sideB'] = true;
    let drawnComb: FramePair = new FramePair(false, false);
    const drawnCombA = formData.get('drawn_comb-a');
    if (drawnCombA) drawnComb['sideA'] = true;
    const drawnCombB = formData.get('drawn_comb-b');
    if (drawnCombB) drawnComb['sideB'] = true;
    let newFrame = {
        box_id: boxID,
        frame_number: frameNumber,
        honey: honey,
        nectar: nectar,
        brood: brood,
        queen_cells: queenCells,
        queen_spotted: queenSpotted,
        drawn_comb: drawnComb,
        recorded: true
    }
    // let newFrame = new FrameFormGroup(boxID, frameNumber, honey, nectar, brood, queenSpotted, queenCells, drawnComb, true);
    return newFrame;
}

function showFramesSection(frames: FrameFormGroup[], boxName: string) {
    framesSection.classList.remove('hide');
    let currentIndex = 0;
    const numFrames = frames.length;
    const render = () => {
        framesSection.innerHTML = '';
        const currentFrame = frames[currentIndex];
        const form = loadFrameForm(boxName, currentFrame, currentIndex, numFrames);
        framesSection.appendChild(form);
        const prevBtn = form.querySelector('#previous-button');
        const nextBtn = form.querySelector('#next-button');
        const nextBoxButton = form.querySelector("#next-box-button")
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                saveCurrentData(form);
                currentIndex--;
                render();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                saveCurrentData(form);
                currentIndex++;
                render();
            });
        }
        if (nextBoxButton) {
            nextBoxButton.addEventListener('click', () => {
                console.log("Next box button clicked");
                saveCurrentData(form);
                const currentBoxButton = document.getElementById(currentFrame['box_id'].toString());
                if (currentBoxButton) {
                    boxesWithFrames.push(frames)
                    currentBoxButton.classList.remove('white');
                    currentBoxButton.classList.add('green');
                    framesSection.classList.add('hide');
                    boxSelectionSection.classList.remove('hide');
                    finishSection.classList.remove('hide');
                    checkIfAllBoxesRecorded();
                }
            });
        }
    };

    const saveCurrentData = (form: HTMLFormElement) => {
        const formData = new FormData(form);
        const currentFrame = frames[currentIndex];
        frames[currentIndex] = convertFormDataToFrame(
            currentFrame['box_id'],
            currentFrame['frame_number'],
            formData
        );
    };

    render();
}

function finishInspection() {
    let recordedFrames: Frame[] = [];
    let averages: Average[] = [];
    boxesWithFrames.forEach(box => {
        if (boxes) {
            const boxObject: Box | undefined = boxes.find(currBox => currBox['box_id'] === box[0]['box_id']);
            if (boxObject) {
                const recordedFramePairs = box.filter(currBox => currBox['recorded']);
                let honeyTotal: number = 0;
                let nectarTotal: number = 0;
                let broodTotal: number = 0;
                let drawnCombTotal: number = 0;
                let queenCellsTotal: number = 0;
                let queenSpotted: string = "Not Spotted";

                recordedFramePairs.forEach(frameGroup => {
                    if (frameGroup['recorded']) {
                        if (frameGroup['honey']['sideA']) honeyTotal += 1;
                        if (frameGroup['honey']['sideB']) honeyTotal += 1;
                        if (frameGroup['nectar']['sideA']) nectarTotal += 1;
                        if (frameGroup['nectar']['sideB']) nectarTotal += 1;
                        if (frameGroup['brood']['sideA']) broodTotal += 1;
                        if (frameGroup['brood']['sideB']) broodTotal += 1;
                        if (frameGroup['drawn_comb']['sideA']) drawnCombTotal += 1;
                        if (frameGroup['drawn_comb']['sideB']) drawnCombTotal += 1;
                        if (frameGroup['queen_cells']['sideA']) queenCellsTotal += 1;
                        if (frameGroup['queen_cells']['sideB']) queenCellsTotal += 1;
                        if (frameGroup['queen_spotted']['sideA']) queenSpotted = `${frameGroup['frame_number']}A`;
                        if (frameGroup['queen_spotted']['sideB']) queenSpotted = `${frameGroup['frame_number']}B`;
                        const newFrameSideA = new Frame(
                            0,
                            boxObject['box_id'],
                            0,
                            boxObject['box_name'],
                            `${frameGroup['frame_number']}A`,
                            frameGroup['drawn_comb']['sideA'],
                            frameGroup['honey']['sideA'],
                            frameGroup['nectar']['sideA'],
                            frameGroup['brood']['sideA'],
                            frameGroup['queen_spotted']['sideA']
                        );
                        recordedFrames.push(newFrameSideA);
                        const newFrameSideB = new Frame(
                            0,
                            boxObject['box_id'],
                            0,
                            boxObject['box_name'],
                            `${frameGroup['frame_number']}B`,
                            frameGroup['drawn_comb']['sideB'],
                            frameGroup['honey']['sideB'],
                            frameGroup['nectar']['sideB'],
                            frameGroup['brood']['sideB'],
                            frameGroup['queen_spotted']['sideB']
                        );
                        recordedFrames.push(newFrameSideB);
                    }
                });
                const numFramesRecoreded = recordedFramePairs.length;
                if (numFramesRecoreded > 0) {
                    let boxAverage: Average = new Average(
                    0,
                    0,
                    boxObject['box_name'],
                    recordedFramePairs.length,
                    `${Math.trunc((honeyTotal / numFramesRecoreded) * 100)}%`,
                    `${Math.trunc((nectarTotal / numFramesRecoreded) * 100)}%`,
                    `${Math.trunc((broodTotal / numFramesRecoreded) * 100)}%`,
                    `${Math.trunc((queenCellsTotal / numFramesRecoreded) * 100)}%`,
                    `${Math.trunc((drawnCombTotal / numFramesRecoreded) * 100)}%`,
                    queenSpotted
                );
                averages.push(boxAverage);
                }
            }
        }
    });
    sessionStorage.setItem("frames", JSON.stringify(recordedFrames));
    sessionStorage.setItem("averages", JSON.stringify(averages));
    window.location.href = "/end";
}

function checkIfAllBoxesRecorded() {
    if (boxesWithFrames.length === boxes?.length) {
        finishButton.classList.remove('white');
        finishButton.classList.add('green');
        finishButton.classList.add('full');
        finishButton.classList.add('large');
    }
}

initializeApp("Frames").then(async () => {
    try {
        const hiveIdSessionStorage = sessionStorage.getItem('hiveId');
        if (hiveIdSessionStorage) {
            const hiveId = JSON.parse(hiveIdSessionStorage);
            boxes = await getBoxesForHiveID(hiveId, true);
            showBoxSelection();
            finishButton.addEventListener('click', () => {
                finishInspection();
            });
        } else {
            throw new Error(`No hive ID found, please go back home and try again.`)
        }

    } catch (error: any) {
        createMessage(error, 'main-message', 'error');
    }
    loading.classList.add('hide');
    mainElement.classList.remove('hide');
});