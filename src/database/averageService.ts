import { Average, AverageDetail } from "../models";

const baseURL: string = "https://montesown.com/buzznote-api/averages";

export async function getAverageForId(inspectionId: number): Promise<AverageDetail[] | null> {
    try {
        console.log(`${baseURL}/${inspectionId}`)
        const response = await fetch(`${baseURL}/${inspectionId}`);

        if (!response.ok) {
            const errorMessage = await response.json();
            if (response.status === 404) {
                return null;
            }
            throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
        }

        const data = await response.json() as AverageDetail[];
        return data;
    } catch (error: any) {
        throw error;
    }
}

export async function addAverage(newAverage: Average) {
    try {
            const response = await fetch(baseURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAverage),
            });
    
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
            }
    
            const data = await response.json() as Average;
            return data;
        } catch (error: any) {
            throw error;
        }
}