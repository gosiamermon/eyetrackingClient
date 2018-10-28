import { ApiSubject } from '../app/shared/api.subjectBased.model';


export async function saveExperiment(
  url: string,
  subjects: ApiSubject[],
) {
  try {
    await fetch(`${url}subjects`, {
      body: JSON.stringify(subjects),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
      mode: "cors",
    })
  } catch (e) {
    alert("Couldn't save experiment!"); // dispatch failure
    return;
  }
  return;
};