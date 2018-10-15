import { ApiExperiment, ApiSession } from '../app/shared/api.sessionBased.model';

export async function saveExperiment(
  url: string,
  apiExperiment: ApiExperiment,
) {
  let response;
  try {
    response = await fetch(`${url}experiments`, {
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
  return await response.json();
};

export async function saveSession(
  url: string,
  apiSession: ApiSession,
) {
  try {
    await fetch(`${url}sessions`, {
      body: JSON.stringify(apiSession),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
      mode: "cors",
    })
  } catch (e) {
    alert("Couldn't save session!"); // dispatch failure
    return;
  }
};
