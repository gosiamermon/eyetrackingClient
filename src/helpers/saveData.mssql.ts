import {
  ApiExperiment,
  ApiStymulus,
} from '../app/shared/api.shared.model';
import { mssqlClassicUrl } from '../config/apiurls';
import { Experiment } from '../app/shared/model';
import { prepareExperiment } from './prepareData.mssql';

export async function saveExperiment(experiment: Experiment) {
  const apiExperiment: ApiExperiment = prepareExperiment(experiment);

  let experimentResponse;
  try {
    experimentResponse = await fetch(`${mssqlClassicUrl}experiments`, {
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

export async function saveStymulus(apiStymulus: ApiStymulus) {
  let stymulusResponse;

  try {
    stymulusResponse = await fetch(`${mssqlClassicUrl}stymulus`, {
      body: JSON.stringify(apiStymulus),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
      mode: "cors",
    })
  } catch (e) {
    alert("Couldn't save stymulus!");
    return;
  }
  return await stymulusResponse.json();
}
