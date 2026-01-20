export type FloorTranscript = {
  dateTime: string;
  sessionType: string;
  location: string;
  dayType: string;
  text: string;
};

export type HearingTranscript = {
  id: number;
  filename: string;
  title: string;
  address: string;
  startTime: string;
  endTime: string;
  date: string;
  committees: {
    chamber: string;
    type: string;
    name: string;
  }[];
  text: string;
};
