import type { InspectionListItem } from "../models";


const baseURL: string = "https://montesown.com/buzznote-api/search/";

export async function getInspectionsForHiveID(hiveID: number): Promise<InspectionListItem[]> {
    try {
        const response = await fetch(`${baseURL}hives/${hiveID}`);

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

export async function getInspectionsByDateRange(startDate: string, endDate: string): Promise<InspectionListItem[]> {
    try {
        const response = await fetch(`${baseURL}date-range/${startDate}/${endDate}`);

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

export async function getInspectionsByTempRange(minTemp: number, maxTemp: number): Promise<InspectionListItem[]> {
    try {
        const response = await fetch(`${baseURL}temp-range/${minTemp}/${maxTemp}`);

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

export async function getInspectionByWeather(condition: string): Promise<InspectionListItem[]> {
    try {
        const response = await fetch(`${baseURL}weather/${condition}`);

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

export async function FilterQueenSpotted(queenSpotted: number): Promise<InspectionListItem[]> {
    try {
        const response = await fetch(`${baseURL}queen/${queenSpotted.toString()}`);

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