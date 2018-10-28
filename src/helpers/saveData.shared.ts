
import { Stymulus, Experiment, SessionData } from '../app/shared/model';
import { ApiExperiment, ApiStymulus, ApiSubject, ApiSession, ApiMeasurement } from '../app/shared/api.shared.model';
import { prepareExperiment, prepareSubject, prepareSession } from './prepareData.shared';


export async function saveImagesToDisk(url: string, stymulus: Stymulus[]) {
  let imagesResponse;

  try {
    imagesResponse = await fetch(`${url}stymulus/images`, {
      body: JSON.stringify(stymulus),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
      mode: "cors",
    })
  } catch (e) {
    alert("Couldn't save images on disk!");
    return;
  }
  return await imagesResponse.json();
}

export async function saveExperiment(
  url: string,
  experiment: Experiment,
  stymulus: ApiStymulus[],
) {
  const apiExperiment: ApiExperiment = prepareExperiment(experiment, stymulus);

  let experimentResponse;
  try {
    experimentResponse = await fetch(`${url}experiments`, {
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

  return await experimentResponse.json();
};

export async function saveAllExperiment(url: string, experiment: ApiExperiment) {
  try {
    await fetch(`${url}experiments`, {
      body: JSON.stringify(experiment),
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

export async function saveSubject(url: string, session: SessionData) {
  const apiSubject: ApiSubject = prepareSubject(session);
  let subjectResponse;

  try {
    subjectResponse = await fetch(`${url}subjects`, {
      body: JSON.stringify(apiSubject),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
      mode: "cors",
    })
  } catch (e) {
    alert("Couldn't save subject!");
    return;
  }
  return await subjectResponse.json();
}

export async function saveSession(
  url: string,
  session: SessionData,
  savedExperimentId: number,
  savedSubjectId: number
) {
  const apiSession: ApiSession = prepareSession(
    session,
    savedExperimentId,
    savedSubjectId,
  )

  let sessionResponse;

  try {
    sessionResponse = await fetch(`${url}sessions`, {
      body: JSON.stringify(apiSession),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
      mode: "cors",
    })
  } catch (e) {
    alert("Couldn't save session!");
    return;
  }

  return await sessionResponse.json();
}


export async function saveMeasurements(url: string, apiMeasurements: ApiMeasurement[]) {
  try {
    await fetch(`${url}measurements`, {
      body: JSON.stringify(apiMeasurements),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
      mode: "cors",
    })
  } catch (e) {
    alert("Couldn't save measurements!");
    return;
  }
  return;
}
