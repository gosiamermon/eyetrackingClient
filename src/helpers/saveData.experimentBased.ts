import { ApiExperiment, ApiMongoExperiment } from '../app/shared/api.experimentBased.model';

export async function saveExperiment(
  url: string,
  apiExperiment: ApiExperiment | ApiMongoExperiment,
) {
  try {
    await fetch(`${url}experiments`, {
      body: JSON.stringify(apiExperiment),
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
};