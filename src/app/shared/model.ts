export interface Action {
  type: string;
  payload: any;
};

export interface SessionData {
  startDate: string;
  endDate: string;
  id: string;
  age: string;
  sex: string;
  educationLevel: string;
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
  calibrationData: Array<{
    sessionId: string;
    measurements: Calibration[];
  }>;
  measurementsData: Array<{
    sessionId: string;
    measurements: Measurement[];
  }>;
  stymulus: Stymulus[];
}

export interface DataPerStymulus {
  stymulus: {
    link?: string;
    startTime: number;
    endTime: number;
    experimentId: number;
    stymulusType: "image" | "Point2D" | "video";
    x?: number;
    y?: number;
  };
  measurements: Array<{
    timestamp: number;
    x: number;
    y: number;
    sessionId: number;
    isCalibration: number;
  }>;
}

export interface MeasurementsSet {
  sessionId: string;
  measurements: Array<{
    timestamp: number;
    x: number;
    y: number;
    isCalibration: number;
    stymulusId: number;
  }>;
}