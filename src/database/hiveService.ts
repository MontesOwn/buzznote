import { Hive } from "../models";

const baseURL: string = "https://montesown.com/buzznote-api/hives/";

export async function getAllHives(active: boolean) {
    let url: string = ""
    if (active) {
        url = baseURL + "active";
    }
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error loading hives: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json() as Hive[];
    return data;
}