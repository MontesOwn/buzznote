import { Frame } from "../models";

const baseURL: string = "https://montesown.com/buzznote-api/frames";

export async function getFramesForInspectionIDAndBoxName(inspectionID: number, boxName: string): Promise<Frame[]> {
    try {
        const response = await fetch(`${baseURL}/${inspectionID}/${boxName}`);

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
        }

        const data = await response.json() as Frame[];
        return data;
    } catch (error: any) {
        throw error;
    }
}

export async function addNewFrame(frame: Frame): Promise<{message: string, frame_id: string}> {
    try {
        const response = await fetch(baseURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(frame),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
        }

        const data = await response.json() as {message: string, frame_id: string};
        return data;
    } catch (error: any) {
        throw error;
    }
}