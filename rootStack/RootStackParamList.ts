export type RootStackParamList = {
  HomeScreen: undefined;
  EventDetail: { slug?: string; }; // รองรับทั้งสองรูปแบบ
  SearchScreen: undefined;
  ProfileScreen: undefined;
  TagScreen: undefined;
  EventTag: { tag: string }; 
  TicketScreen: undefined;
  TicketDetail: { registrationId: number };
  ReviewScreen: { eventId: number };
  ScanQR: undefined;
};
