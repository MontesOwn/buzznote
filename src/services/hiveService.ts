import { Hive } from "../models";

const baseURL: string = "https://montesown.com/buzznote-api/hives";

export async function getAllHives(active: boolean): Promise<Hive[]> {
    try {
        let url: string = ""
        if (active) {
            url = baseURL + "/active";
        } else {
            url = baseURL;
        }
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error loading hives: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json() as Hive[];
        return data;
    } catch (error: any) {
        throw error;
    }
}

export async function getHiveForID(hiveId: number): Promise<Hive> {
    try {
        const response = await fetch(`${baseURL}/${hiveId}`);

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
        }

        const data = await response.json() as Hive;
        return data;
    } catch (error: any) {
        throw error;
    }
}

export async function updateHive(hive: Hive) {
    try {
        const response = await fetch(`${baseURL}/${hive['hive_id']}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hive),
        });
        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        throw error;
    }
}

export async function addNewHive(hive: Hive): Promise<{message: string, hive_id: string}> {
    try {
        const response = await fetch(baseURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hive),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
        }

        const data = await response.json() as {message: string, hive_id: string};
        return data;
    } catch (error: any) {
        throw error;
    }
}

export async function updateNumBoxesForID(hiveID: number, numBoxes: number) {
    try {
        const response = await fetch(`baseURL/${hiveID}/boxes`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(numBoxes),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
        }

        const data = await response.json() as Hive;
        return data;
    } catch (error: any) {
        throw error;
    }
}