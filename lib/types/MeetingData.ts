interface MeetingData {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  date: string;
  time: string;
  price: string;
  groupName: string;
  groupIcon: string;
  participants: number;
  maxParticipants: number;
  isFull: boolean;
  tags: string[];
}

export type { MeetingData };
