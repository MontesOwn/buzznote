import { initializeApp } from "./main";
import { createMessage, createItemTable, makeElement, createButton, formatDateTime, createListTable } from "./modules/utils";
import { getInspectionForId, updateInspection } from "./database/inspectionService";
import { Frame, Inspection } from "./models";
import { getAverageForId } from "./database/averageService";
import { getFramesForInspectionIDAndBoxName } from "./database/frameService";

const mainElement = document.querySelector('main') as HTMLElement;
const backButton = document.getElementById('back-button') as HTMLElement;
const loading = document.getElementById('loading') as HTMLElement;

function setBackHref(sentFrom: string, year: string | null) {
    switch (sentFrom) {
        case "past":
            if (year) {
                backButton.setAttribute('href', `/past/?year=${year}`);
            } else {
                backButton.setAttribute('href', '/past/');
            }
    }
}

async function submitData(formData: FormData, inspeciton: Inspection) {
    try {
        const updatedNotes = formData.get('textAreaInput');
        if (updatedNotes === null || updatedNotes.toString().trim() === "") {
            throw new Error("Please do not leave the notes empty");
        }
        const now = new Date();
        const formatedDateTime = formatDateTime(now);
        inspeciton['notes'] = updatedNotes.toString();
        inspeciton['last_updated'] = formatedDateTime;
        const response = await updateInspection(inspeciton);
        displayNotes(response);
    } catch (error: any) {
        createMessage(error, 'edit-message', 'error');
    }
}

function displayNotes(inspeciton: Inspection) {
    const editNotesForm = document.getElementById('edit-notes-form');
    if (editNotesForm) editNotesForm.remove();
    const notesDiv = makeElement("div", 'notes-display', null, null);
    const notesHeading = makeElement("h2", null, null, "Notes");
    notesDiv.appendChild(notesHeading);
    const notesP = document.createElement('p');
    notesP.textContent = inspeciton['notes'];
    notesDiv.appendChild(notesP);
    if (inspeciton['last_updated']) {
        const lastUpdatedP = document.createElement('p');
        const updatedKey = makeElement('b', null, null, "Last Updated: ");
        lastUpdatedP.appendChild(updatedKey);
        const updatedValue = makeElement('span', null, null, inspeciton['last_updated'].toString());
        lastUpdatedP.appendChild(updatedValue);
        notesDiv.appendChild(lastUpdatedP);
    }
    const addNotesButton = createButton("Add/Edit Notes", 'button', 'edit-button', 'button white', "edit");
    addNotesButton.addEventListener('click', () => displayEditNotesForm(inspeciton));
    notesDiv.appendChild(addNotesButton);
    mainElement.appendChild(notesDiv);
}

function displayEditNotesForm(inspeciton: Inspection) {
    const notesDiv = document.getElementById('notes-display');
    if (notesDiv) notesDiv.remove();
    const editNotesForm = makeElement("form", 'edit-notes-form', null, null) as HTMLFormElement;
    const formMessage = makeElement("section", "edit-message", "message-wrapper", null);
    editNotesForm.appendChild(formMessage);
    const formHeading = makeElement("h2", null, null, "Add/Edit Notes:");
    editNotesForm.appendChild(formHeading);
    const textAreaInput: HTMLTextAreaElement = document.createElement('textarea');
    textAreaInput.id = 'textAreaInput';
    textAreaInput.name = 'textAreaInput';
    textAreaInput.value = inspeciton['notes'];
    editNotesForm.appendChild(textAreaInput);
    const cancelButton = createButton("Cancel", 'button', 'cancel', 'button red');
    cancelButton.addEventListener('click', () => {
        displayNotes(inspeciton);
    });
    editNotesForm.appendChild(cancelButton);
    const submitButton = createButton("Submit", 'submit', 'submit', 'button green');
    editNotesForm.appendChild(submitButton);
    editNotesForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData: FormData = new FormData(editNotesForm);
        await submitData(formData, inspeciton);
    })
    mainElement.appendChild(editNotesForm);
}

function getVisualClassesForFrameType(frame: Frame): string {
    if (frame.brood) {
        return "brood";
    } else if (frame.honey || frame.nectar) {
        return "honey";
    } else if (frame.drawn_comb) {
        return "draw-comb";
    } else {
        return "none";
    }
}

function makeLegendKey(frameType: string) {
    const newKeyDiv = makeElement("label", null, null, null);
    const keyDot = makeElement("span", null, frameType, null);
    newKeyDiv.appendChild(keyDot);
    const keyText = makeElement("p", null, null, frameType);
    newKeyDiv.appendChild(keyText);
    return newKeyDiv;
}

initializeApp("Loading").then(async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const idString = urlParams.get('inspectionId');
        const sentFrom = urlParams.get('sentFrom');
        const year = urlParams.get('year');
        if (sentFrom && year) {
            setBackHref(sentFrom, year);
        } else if (sentFrom) {
            setBackHref(sentFrom, null);
        }
        if (idString) {
            const inspectionId = parseInt(idString);
            const inspeciton = await getInspectionForId(inspectionId);
            document.title = `${inspeciton['inspection_date']} - Buzznote`;
            const inspectionHeading = makeElement("h2", null, null, `${inspeciton['hive_name']} | ${inspeciton['inspection_date']} | ${inspeciton['start_time']}`);
            mainElement.appendChild(inspectionHeading);
            //Display the inspection details
            const inspectionColumnHeaders: string[] = [
                'weather',
                'bee_population',
                'drone_population',
                'laying_pattern',
                'hive_beetles',
                'other_pests',
                'brood'
            ]
            const overviewTable = createItemTable(inspeciton, inspectionColumnHeaders, 'inspection_id');
            mainElement.appendChild(overviewTable);
            const averages = await getAverageForId(inspeciton['inspection_id']);
            if (averages) {
                //Display averages (accordian with all frames)
                const averagesHeading = makeElement("h2", null, null, "Box Averages");
                mainElement.appendChild(averagesHeading);

                const averagesColumnHeaders = ['box_name', 'num_frames', 'honey', 'nectar', 'brood', 'queen_cells', 'drawn_comb', 'queen_spotted', 'expand'];
                for (const currentAverage of averages) {
                    const newAverageTable = createItemTable(currentAverage, averagesColumnHeaders, 'average_id');
                    mainElement.appendChild(newAverageTable);

                    const frames: Frame[] = await getFramesForInspectionIDAndBoxName(
                        inspeciton['inspection_id'],
                        currentAverage['box_name']
                    );

                    const framesColumnHeaders: string[] = ['frame_number', 'honey', 'nectar', 'brood', 'queen_cells', 'drawn_comb']
                    const framesTable = createListTable(frames, framesColumnHeaders, 'frame_id');
                    framesTable.classList.add('hide');
                    mainElement.appendChild(framesTable);
                    const expandButton = newAverageTable.querySelector('button') as HTMLElement;
                    expandButton.addEventListener('click', () => {
                        // Toggle all frames table using the 'frames' array
                        framesTable.classList.toggle('hide');
                        if (currentAverage['showFrames'] === true) {
                            currentAverage['showFrames'] = false;
                            expandButton.textContent = "expand_all";
                        } else {
                            currentAverage['showFrames'] = true;
                            expandButton.textContent = "collapse_all";
                        }
                    });

                    const boxContainer = makeElement("div", null, "box-container", null);
                    frames.forEach(frame => {
                        const classesForFrame: string = `frame-container ${getVisualClassesForFrameType(frame)}`;
                        const frameContainer = makeElement("div", null, classesForFrame, null);
                        const containerText = `${frame['frame_number']} ${currentAverage['queen_spotted'] === frame['frame_number'] ? 'Queen Spotted ' : ''} ${frame.queen_cells ? 'Queen Cells' : ''}`;
                        const containerP = makeElement("p", null, "frame-text", containerText);
                        frameContainer.appendChild(containerP);
                        boxContainer.appendChild(frameContainer);
                    });
                    mainElement.appendChild(boxContainer);
                }
                const visualFieldset = makeElement("fieldset", "visual-legend", null, null);
                const legendTitle = makeElement("legend", null, null, "Legend");
                visualFieldset.appendChild(legendTitle);
                const honeyKey = makeLegendKey("honey");
                visualFieldset.appendChild(honeyKey);
                const nectarKey = makeLegendKey("nectar");
                visualFieldset.appendChild(nectarKey);
                const drawKey = makeLegendKey("draw-comb");
                visualFieldset.appendChild(drawKey);
                const broodKey = makeLegendKey("brood");
                visualFieldset.appendChild(broodKey);
                const noneKey = makeLegendKey("none");
                visualFieldset.appendChild(noneKey);
                mainElement.appendChild(visualFieldset);
            } else {
                const noFrames = makeElement("h2", "no-frames", null, "No frames recorded");
                mainElement.appendChild(noFrames);
            }
            //Display notes
            displayNotes(inspeciton);
            loading.classList.add('hide');
        } else {
            throw new Error("Could not load inspection details. Please return to the previous page and try again");
        }
    } catch (error: any) {
        createMessage(error, 'main-message', 'error');
        loading.classList.add('hide');
    }

})