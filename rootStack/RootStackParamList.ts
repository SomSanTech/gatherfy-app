export type RootStackParamList = {
  HomeScreen: undefined;
  EventDetail: { slug?: string; }; // รองรับทั้งสองรูปแบบ
  SearchScreen: undefined;
  ProfileScreen: undefined;
  TagScreen: undefined;
  EventTag: { tag: string }; 
  TicketScreen: undefined;
  TicketDetail: { eventId: number , slug: string };
  ReviewScreen: { eventId: number };
  ScanQR: undefined;
  ContactScreen: undefined;
  ShareProfile: { username: string; };
  ScanQrContact: undefined
};
