import { initializeApp } from "./main";
import { getListOfInspections } from "./database/inspectionService";
import type { InspectionListItem } from "./models";
import { createButton, createMessage, makeElement, createListTable } from "./modules/utils";

const mainElement = document.querySelector('main') as HTMLElement;
const loading = document.getElementById('loading') as HTMLElement;
let inspections: InspectionListItem[] | null = null;
let yearsList: string[] = [];

function getYear(date: string): string {
    return date.split("-")[0];
}

function getYears() {
    if (inspections) {
        const years: string[] =  inspections.reduce((acc: string[], currentInspection: InspectionListItem) => {
            const yearForCurrentInspection = getYear(currentInspection['inspection_date']);
            if (!acc.includes(yearForCurrentInspection)) {
                acc.push(yearForCurrentInspection);
            }
            return acc;
        }, [] as string[]);
        yearsList = years;
    }
}

function loadYearSelector(year: string) {
    const yearSelector = yearsList.reduce((acc: HTMLElement, currentYear: string) => {
        const yearButton = createButton(currentYear, "button", currentYear, "button white");
        if (year === currentYear) {
            yearButton.classList.remove('white');
            yearButton.classList.add('blue');
        }
        yearButton.addEventListener('click', () => {
            displayInspections(currentYear);
        });
        acc.appendChild(yearButton);
        return acc;
    }, document.createElement('section'));
    yearSelector.setAttribute('class', "button-group-row");
    yearSelector.setAttribute('id', "year-selector");
    mainElement.appendChild(yearSelector);
}

function filterInspectionsForYear(year: string) {
    if (inspections) {
        return inspections.filter(inspeciton => getYear(inspeciton['inspection_date']) === year);
    }
}

function displayInspections(year: string) {
    mainElement.innerHTML = '';
    loadYearSelector(year);
    const inspectionsToShow = filterInspectionsForYear(year);
    const columnHeaders: string[] = ['hive_name', 'inspection_date', 'start_time', 'num_boxes', 'total_frames'];
    if (inspectionsToShow) {
        const inspectionsTable = createListTable(inspectionsToShow, columnHeaders);
        const rows = inspectionsTable.querySelectorAll('tr');
        rows.forEach(row => row.addEventListener('click', () => window.location.href = `/past/inspectionDetail?inspectionId=${row.id}`));
        mainElement.appendChild(inspectionsTable);
    }
}

initializeApp("Past Inspections").then(async () => {
    try {
        inspections = await getListOfInspections();
        getYears();
        displayInspections(yearsList[yearsList.length - 1]);
        loading.classList.add('hide');
    } catch (error: any) {
        loading.classList.add('hide');
        createMessage(error, 'main-message', 'error');
    }
});