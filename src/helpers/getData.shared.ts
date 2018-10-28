import {
  mssqlClassicUrl,
  mongoClassicUrl,
  cassandraClassicUrl,
  mongoExperimentBasedUrl,
  cassandraExperimentBasedUrl,
  mongoSubjectBasedUrl,
  cassandraSubjectBasedUrl,
} from '../config/apiurls';

export async function getAllExperiment(url: string) {
  try {
    await fetch(url, {
      method: "GET",
      mode: "cors",
    })
  } catch (e) {
    alert("Couldn't get experiments!"); // dispatch failure
    return;
  }
  return;
}

export const get10Times = async () => {
  const mssqlClassicIds = ["1204", "1205", "1206", "1207", "1208", "1209", "1210", "1211", "1212", "1213"];
  const cassandraClassicIds = ["de8bf823-cd0e-4840-8335-9e220b07980b", "235d3831-d151-4171-b247-74bd56fcbc26",
    "6dd7d7c3-3901-4014-a9c0-eefa2cb9816f", "6cae143d-5438-43a1-a6c5-a260dda11603",
    "de993373-9b12-4930-9846-e230a2601282", "e1174cea-19f7-4226-9064-fc32674cb0ba",
    "2787ec5b-a2c8-466a-9587-8edadbdc70a3", "64aaba8f-b314-4837-b039-4690dd020b53",
    "948412b5-dc45-4add-97cb-7cfb36e025fd", "f6f78aee-2ab0-4211-8e8d-6a280e14aca5"];
  const mongoClassicIds = ["5bd1cbe9091531279cb76042", "5bd1cbec091531279cb84b0e", "5bd1cbef091531279cb935d3", "5bd1cbf1091531279cba2098",
    "5bd1cbf3091531279cbb0b5d", "5bd1cbf5091531279cbbf622", "5bd1cbf7091531279cbce0e7", "5bd1cbf9091531279cbdcbac", "5bd1cbfc091531279cbeb671",
    "5bd1cbfe091531279cbfa136"];

  const cassandraExperimentIds = ["c5fe3160-d69d-11e8-af23-338a26727573", "ca2aeb20-d69d-11e8-af23-338a26727573",
    "d43cbd00-d69d-11e8-af23-338a26727573", "ce9dd5a0-d69d-11e8-af23-338a26727573", "cd339740-d69d-11e8-af23-338a26727573",
    "d2cb79c0-d69d-11e8-af23-338a26727573", "d5b29420-d69d-11e8-af23-338a26727573", "c83b7730-d69d-11e8-af23-338a26727573",
    "d17f4ab0-d69d-11e8-af23-338a26727573", "d01e5b20-d69d-11e8-af23-338a26727573"];
  const mongoExperimentIds = ["5bcedc0a569b8025f89f3949", "5bcedc19569b8025f8a02415", "5bcedc27569b8025f8a10ee1",
    "5bcedc33569b8025f8a1f9ad", "5bcedc41569b8025f8a2e479", "5bcedc4f569b8025f8a3cf45", "5bcedc5b569b8025f8a4ba11",
    "5bcedc69569b8025f8a5a4dd", "5bcedc76569b8025f8a68fa9", "5bcedc83569b8025f8a77a75"];

  const cassandraSubjectIds = ["1dc47307-4f0b-4cda-a74d-97bf0e237b5b", "1eaba53e-403e-4c80-97f2-1ff44a601a1e", "22d58208-7158-44f2-adea-35ae591dbc00",
    "598e44ef-bb80-4231-85d4-d984f70767c9", "6f097f12-918a-460e-8ed1-9c37f1dcd9a5", "82e69e0f-831e-4b30-afad-ba3707685b5e",
    "846ada0c-a7fc-4e90-9fe1-a093a0c8e5bf", "9f23d04d-6663-416a-940c-f6a60cd85abc", "d7612594-8efb-4c08-988d-8c1bedc4970a",
    "e9a164c7-95f0-4586-9f97-3e45282503bd"];

  const mongoSubjectIds = ["5bcedcb4569b8025f8a86541", "5bcedcbc569b8025f8a95049", "5bcedcc3569b8025f8aa3b51",
    "5bcedccb569b8025f8ab2659", "5bcedcd3569b8025f8ac1161", "5bcedce9569b8025f8acfc69", "5bcedcf6569b8025f8ade771",
    "5bcedcff569b8025f8aed279", "5bcedd06569b8025f8afbd81", "5bcedd0e569b8025f8b0a889"];

  const subjectNames = ["alrajhi", "baron", "bilnicka", "danielczyk", "henzel"];
  let j = 0;
  for (let i = 0; i < 10; i++) {
    if (i < 5) {
      j = i;
    } else {
      j = i - 5;
    }
    await getAllExperiment(`${mssqlClassicUrl}experiments/OneQuery/ByExperiment/${mssqlClassicIds[i]}`);
    await getAllExperiment(`${mongoClassicUrl}experiments/OneQuery/ByExperiment/${mongoClassicIds[i]}`);
    await getAllExperiment(`${cassandraClassicUrl}experiments/OneQuery/ByExperiment/${cassandraClassicIds[i]}`);
    await getAllExperiment(`${cassandraExperimentBasedUrl}experiments/${cassandraExperimentIds[i]}`);
    await getAllExperiment(`${mongoExperimentBasedUrl}experiments/${mongoExperimentIds[i]}`);
    await getAllExperiment(`${cassandraSubjectBasedUrl}subjects/OneQuery/ByExperiment/${cassandraSubjectIds[i]}`);
    await getAllExperiment(`${mongoSubjectBasedUrl}subjects/OneQuery/ByExperiment/${mongoSubjectIds[i]}`);

    await getAllExperiment(`${mssqlClassicUrl}experiments/OneQuery/BySubject/${subjectNames[j]}`);
    await getAllExperiment(`${mongoClassicUrl}experiments/OneQuery/BySubject/${subjectNames[j]}`);
    await getAllExperiment(`${cassandraClassicUrl}experiments/OneQuery/BySubject/${subjectNames[j]}`);
    await getAllExperiment(`${cassandraExperimentBasedUrl}experiments/BySubject/${subjectNames[j]}`);
    await getAllExperiment(`${mongoExperimentBasedUrl}experiments/BySubject/${subjectNames[j]}`);
    await getAllExperiment(`${mongoSubjectBasedUrl}subjects/OneQuery/BySubject/${subjectNames[j]}`);
    await getAllExperiment(`${cassandraSubjectBasedUrl}subjects/OneQuery/BySubject/${subjectNames[j]}`);
    console.log(`It is ${i + 1} time`);
  }
}

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
