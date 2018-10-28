import { ApiStymulus, ApiSubject, ApiResponseSession, ApiResponseStymulus } from './api.shared.model';

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
  subject?: ApiSubject;
  measurements: ApiMeasurement[],
  calibration: ApiMeasurement[],
}

export interface ApiExperiment {
  name: string;
  startDate: string;
  endDate: string;
  stymulus: ApiStymulus[];
  sessions: ApiSession[];
  subjectsNames: string[];
}

export interface ApiResponseMongoSubject {
  age: number;
  sex: string;
  educationLevel: string;
  visionDefect: number;
  name?: string;
  sessions: ApiResponseSession[];
}

export interface ApiMongoSubject {
  age: number;
  sex: string;
  educationLevel: string;
  visionDefect: number;
  name?: string;
  sessions: ApiSession[];
}

export interface ApiResponseMongoExperiment {
  id: string | number;
  name: string;
  startDate: string;
  endDate: string;
  stymulus: ApiResponseStymulus[];
  subjects: ApiResponseMongoSubject[];
}

export interface ApiMongoExperiment {
  name: string;
  startDate: string;
  endDate: string;
  stymulus: ApiStymulus[];
  subjects: ApiMongoSubject[];
}
