import { ApiStymulus, ApiSubject } from './api.shared.model';

export interface ApiMeasurement {
  timestamp: number;
  x: number;
  y: number;
  stymulusId: number;
}

export interface ApiSession {
  startDate: string;
  endDate: string;
  deviceType: string;
  deviceError: number;
  deviceProducer: string;
  deviceFrequency: number;
  measurements: ApiMeasurement[],
  calibration: ApiMeasurement[],
}

export interface ApiExperiment {
  name: string;
  startDate: string;
  endDate: string;
  stymulus: ApiStymulus[];
  sessions: ApiSession[];
}

export interface ApiSubject {
  name: string;
  age: number;
  educationLevel: string;
  sex: string;
  visionDefect: number;
  experiment: ApiExperiment;
}
