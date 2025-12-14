import { loadData } from "../modules/utils";

const baseURL: string = "https://montesown.com/buzznote-api/hives/";

export async function getAllHives(active: boolean) {
    let url: string = ""
    if (active) {
        url = baseURL + "active";
    }
    const data = await loadData(url);
    console.log(data);
}