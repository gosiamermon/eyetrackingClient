export interface Experiment {
  name: string;
  startDate: string;
  endDate: string;
  id: string | number;
}

export interface Table {
  experiments: Experiment[];
}