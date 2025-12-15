import type { Box } from "../models";

const baseURL: string = "https://montesown.com/buzznote-api/boxes";

export async function getBoxesForHiveID(hiveID: number, active: boolean): Promise<Box[]> {
  let url: string = "";
  if (active) {
    url = `${baseURL}/hives/${hiveID}/active`;
  } else {
    url = `${baseURL}/hives/${hiveID}`;
  }
  const response = await fetch(url);

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
  }

  const data = await response.json() as Box[]
  return data;
}

export async function getBoxForBoxId(boxId: number) {
  const response = await fetch(`${baseURL}/${boxId}`);

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
  }

  const data = await response.json() as Box;
  return data
}

export async function addBox(box: Box) {

}

export async function updateBox(boxId: number, box: Box) {
  try {
    const response = await fetch(`${baseURL}/${boxId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(box),
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(`${errorMessage.status_code} - ${errorMessage.message}`);
    }

    const data = await response.json() as Box;
    return data;

  } catch (error: any) {
    throw error;
  }
}