import { Inspection, InspectionListItem } from "../models";

const baseURL: string = "https://montesown.com/buzznote-api/inspections";

export async function getListOfInspections(): Promise<InspectionListItem[]> {
    try {
        const response = await fetch(`${baseURL}/list`);

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
        }

        const data = await response.json() as InspectionListItem[];
        return data;
    } catch (error: any) {
        throw error;
    }
}

export async function getInspectionForId(inspectionId: number): Promise<Inspection> {
    try {
        const response = await fetch(`${baseURL}/get/${inspectionId}`);

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
        }

        const data = await response.json() as Inspection;
        return data;
    } catch (error: any) {
        throw error;
    }
}

export async function createInspection(inspection: Inspection) {
    try {
        const response = await fetch(baseURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inspection),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
        }

        const data = await response.json() as Inspection;
        return data;
    } catch (error: any) {
        throw error;
    }
}

export async function updateInspection(inspection: Inspection): Promise<Inspection> {
    try {
        console.log(`${baseURL}/${inspection['inspection_id']}`)
        const response = await fetch(`${baseURL}/${inspection['inspection_id']}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inspection),
        });
        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
        }

        const data = await response.json() as Inspection;
        console.log(data);
        return data;
    } catch (error: any) {
        throw error;
    }
}