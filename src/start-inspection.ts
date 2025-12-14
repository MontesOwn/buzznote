import { makeElement } from "./modules/utils";
import { getAllHives } from "./database/hiveService";

export async function startInspection() {
    const mainElement = document.createElement('main');
    const pageTile = makeElement("h2", "Select a hive");
    mainElement.appendChild(pageTile);
    await getAllHives(true);
    return mainElement;
}