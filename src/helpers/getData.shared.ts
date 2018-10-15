export async function getExperiment(id: string | number, url: string) {
  let experimentResponse;
  try {
    experimentResponse = await fetch(`${url}experiments/${id}`, {
      method: "GET",
      mode: "cors",
    })
  } catch (e) {
    alert("Couldn't get experiments!"); // dispatch failure
    return;
  }
  return await experimentResponse.json();
}

export async function getSessions(experimentId: string | number, url: string) {
  let sessionResponse;
  try {
    sessionResponse = await fetch(`${url}sessions/byExperiment/${experimentId}`, {
      method: "GET",
      mode: "cors",
    })
  } catch (e) {
    alert("Couldn't get sessions!"); // dispatch failure
    return;
  }
  return await sessionResponse.json();
}

export async function getSubject(id: string | number, url: string) {
  let subjectResponse;
  try {
    subjectResponse = await fetch(`${url}subjects/${id}`, {
      method: "GET",
      mode: "cors",
    })
  } catch (e) {
    alert("Couldn't get subject!"); // dispatch failure
    return;
  }
  return await subjectResponse.json();
}

export async function getMeasurements(sessionId: string | number, url: string) {
  let measurementsResponse;
  try {
    measurementsResponse = await fetch(`${url}measurements/${sessionId}`, {
      method: "GET",
      mode: "cors",
    })
  } catch (e) {
    alert("Couldn't get measurements!"); // dispatch failure
    return;
  }
  return await measurementsResponse.json();
}
