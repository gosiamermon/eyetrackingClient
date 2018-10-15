import { Store } from '../../../../../store/model';
import { GET_EXPERIMENTS_SUCCESS } from '../types';
import { Experiment } from '../../model';

export const getExperimentsData = (
  url: string,
  prepareData?: (experiments: Experiment[]) => Experiment[]
) => {
  return async (dispatch: any, getState: () => Store) => {
    let response;
    try {
      response = await fetch(`${url}experiments`, {
        method: "GET",
        mode: "cors",
      })
    } catch (e) {
      alert("Couldn't get experiments!"); // dispatch failure
      return;
    }
    let experiments = await response.json();
    if (prepareData) {
      experiments = prepareData(experiments);
    }
    console.log(experiments);
    dispatch({
      payload: experiments,
      type: GET_EXPERIMENTS_SUCCESS,
    })
  }
}