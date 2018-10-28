import { DataPerStymulus } from './model';


export interface ApiExperiment {
  name: string;
  startDate: string;
  endDate: string;
  stymulus?: ApiStymulus[];
  sessions?: ApiSession[];
  subjects?: ApiSubject[];
}


export interface ApiResponseExperiment extends ApiExperiment {
  id: string | number;
  sessions?: any;
  stymulus?: ApiResponseStymulus[];
}

export interface ApiResponseCassandraExperiment {
  id: string | number;
  sessions?: ApiResponseCassandraSession[];
  name: string;
  startdate: string;
  enddate: string;
  stymulus?: ApiResponseCassandraStymulus[];
}

export interface ApiStymulus {
  link?: string;
  startTime: number;
  endTime: number;
  experimentId?: number | string;
  stymulusType: "image" | "Point2D" | "video";
  x?: number;
  y?: number;
}

export interface ApiResponseStymulus extends ApiStymulus {
  id: string | number;
}

export interface ApiResponseCassandraStymulus {
  id: string | number;
  link?: string;
  starttime: number;
  endtime: number;
  stymulustype: "image" | "Point2D" | "video";
  x?: number;
  y?: number;
}

export interface ApiSession {
  startDate: string;
  endDate: string;
  experimentId?: number | string;
  subjectId?: number | string;
  subjectName?: string;
  deviceType: string;
  deviceError: number;
  deviceProducer: string;
  deviceFrequency: number;
  calibrationPerStymulus?: DataPerStymulus[];
  measurementsPerStymulus?: DataPerStymulus[];
  measurements?: ApiMeasurement[];
  calibration?: ApiMeasurement[];
}

export interface ApiResponseSession extends ApiSession {
  id: string | number;
  subject?: ApiResponseSubject;
  measurements?: ApiResponseMeasurement[];
  calibration?: ApiResponseMeasurement[];
  subjectAge?: number;
  subjectEducationLevel?: string;
  subjectVisionDefect?: boolean;
  subjectSex?: string;
}

export interface ApiResponseCassandraSession {
  startdate: string;
  enddate: string;
  devicefrequency: number;
  deviceproducer: string;
  deviceerror: number;
  devicetype: string;
  id: string | number;
  experimentid: number | string;
  subjectid: string;
  measurements?: ApiResponseCassandraMeasurement[];
  calibration?: ApiResponseCassandraMeasurement[];
  subject?: ApiResponseCassandraSubject
}

export interface ApiSubject {
  age: number;
  sex: string;
  educationLevel: string;
  visionDefect: number;
  name?: string;
}

export interface ApiResponseSubject extends ApiSubject {
  id?: string | number;
}

export interface ApiResponseCassandraSubject {
  id: string | number;
  age: number;
  sex: string;
  educationlevel: string;
  visiondefect: number;
}

export interface ApiMeasurement {
  timestamp: number;
  x: number;
  y: number;
  sessionId?: number | string;
  stymulusId: number;
  isCalibration: number;
}

export interface ApiResponseMeasurement extends ApiMeasurement {
  id: string | number;
}

export interface ApiResponseCassandraMeasurement {
  id: string | number;
  timestamp: number;
  x: number;
  y: number;
  sessionid: number | string;
  stymulusid: number;
  iscalibration: number;
}