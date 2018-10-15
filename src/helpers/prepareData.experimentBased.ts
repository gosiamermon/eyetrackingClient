import { ApiSession } from '../app/shared/api.experimentBased.model';
import { SessionData, Experiment } from '../app/shared/model';
import { ApiSubject, ApiStymulus } from '../app/shared/api.shared.model';
import { ApiMeasurement, ApiExperiment } from '../app/shared/api.experimentBased.model';

export const prepareSession = (
  session: SessionData,
  subject: ApiSubject,
  measurements: ApiMeasurement[],
  calibration: ApiMeasurement[],
): ApiSession => {
  return {
    calibration,
    deviceError: Number(session.deviceError),
    deviceFrequency: Number(session.deviceFrequency),
    deviceProducer: session.deviceProducer,
    deviceType: session.deviceType,
    endDate: session.endDate,
    measurements,
    startDate: session.startDate,
    subject,
  };
};

export const prepareExperiment = (
  experiment: Experiment,
  stymulus: ApiStymulus[],
  sessions: ApiSession[]
): ApiExperiment => {
  return {
    endDate: experiment.endDate,
    name: experiment.name,
    sessions,
    startDate: experiment.startDate,
    stymulus,
  };
};