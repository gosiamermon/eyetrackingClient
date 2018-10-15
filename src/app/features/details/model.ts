export interface Details {
  experiment: Experiment;
};

export interface Experiment {
  id: string | number;
  name: string;
  startDate: string;
  endDate: string;
  stymulus?: Stymulus[];
  sessions?: Session[];
};

export interface Subject {
  age: number;
  sex: string;
  educationLevel: string;
  visionDefect: number;
};

export interface Measurement {
  time: number;
  timestamp: number;
  x: number;
  y: number;
  stymulusId: number;
};

export interface Session {
  id: string | number;
  startDate: string;
  endDate: string;
  deviceType: string;
  deviceError: number;
  deviceProducer: string;
  deviceFrequency: number;
  subject: Subject;
  measurements: Measurement[],
  calibration: Measurement[],
};

export interface Stymulus {
  id: number;
  link?: string;
  startTime: number;
  endTime: number;
  experimentId?: number | string;
  stymulusType: "image" | "Point2D" | "video";
  x?: number;
  y?: number;
};
