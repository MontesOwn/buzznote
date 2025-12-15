import { initializeApp } from "./main";
import { createMessage, createItemTable, makeElement } from "./modules/utils";
import { getInspectionForId } from "./database/inspectionService";

const mainElement = document.querySelector('main') as HTMLElement;
const loading = document.getElementById('loading') as HTMLElement;

initializeApp("Loading").then(async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const idString = urlParams.get('inspectionId');
        if (idString) {
            const inspectionId = parseInt(idString);
            const inspeciton = await getInspectionForId(inspectionId);
            document.title = `${inspeciton['inspection_date']} - Buzznote`;
            const inspectionHeading = makeElement("h2", null, null, `${inspeciton['hive_name']} | ${inspeciton['inspection_date']} | ${inspeciton['start_time']}`);
            mainElement.appendChild(inspectionHeading);
            //Display the inspection details
            const columnHeaders: string[] = [
                'weather', 
                'bee_population', 
                'drone_population', 
                'laying_pattern', 
                'hive_beetles',
                'other_pests',
                'brood'
            ]
            const overviewTable = createItemTable(inspeciton, columnHeaders);
            mainElement.appendChild(overviewTable);
            //Display averages (accordian with all frames)
            const averagesHeading = makeElement("h2", null, null, "Box Averages");
            mainElement.appendChild(averagesHeading);
            const comingSoon = document.createElement('p');
            comingSoon.textContent = "Box averages and frame details coming soon";
            mainElement.appendChild(comingSoon);
            //Display notes
            const notesHeading = makeElement("h2", null, null, "Notes");
            mainElement.appendChild(notesHeading);
            const notesP = document.createElement('p');
            notesP.textContent = inspeciton['notes'];
            mainElement.appendChild(notesP);
            loading.classList.add('hide');
        } else {
            throw new Error("Could not load inspection details. Please return to the previous page and try again");
        }
    } catch (error: any) {
        createMessage(error, 'main-message', 'error');
        loading.classList.add('hide');
    }
    
})