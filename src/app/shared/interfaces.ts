export interface Action {
  type: string;
  payload: any;
};

export interface SessionData {
  id: string;
  age: string;
  sex: string;
  educationlevel: string;
  visionDefect: string;
  deviceType: string;
  deviceError: string;
  deviceProducer: string;
  deviceFrequency: string;
};

export interface Calibration {
  timestamp: string;
  type: string;
  x: string;
  y: string;
  stymulusType: string;
}

export interface Measurement {
  timestamp: string;
  type: string;
  x: string;
  y: string;
  stymulusType: string;
  imageFileName: string;
}

export interface Stymulus {
  binaryString: string;
  fileName: string;
}

export interface Experiment {
  name: string;
  startDate: string;
  endDate: string;
  sessionData: SessionData[];
  calibration: Calibration[][];
  measurements: Measurement[][];
  stymulus: Stymulus[];
}

export interface ClassicMssqlStymulus {
  link: string;
  startTime: string;
  endTime: string;
  stymulusType: "image" | "point2D" | "video";
  x: number;
  y: number;
}

export interface ClassicMssqlExperiment {
  name: string;
  startDate: string;
  endDate: string;
  stymulus: ClassicMssqlStymulus;
}


export interface ClassicMssqlSession {
  startDate: string;
  endDate: string;
  experimentId: number;
  subjectId: number;
  deviceType: string;
  deviceError: number;
  deviceProducer: string;
  deviceFrequency: number;
}

export interface ClassicMssqlSubject {
  age: number;
  sex: string;
  educationLevel: string;
  visionDefect: number;
}

export interface ClassicMssqlMeasurements {
  timestamp: number;
  x: number;
  y: number;
  sessionId: number;
  stymulusId: number;
  isCalibration: number;
}
