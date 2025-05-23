export type RootStackParamList = {
  HomeScreen: undefined;
  EventDetail: { slug?: string }; // รองรับทั้งสองรูปแบบ
  SearchScreen: undefined;
  ProfileScreen: undefined;
  TagScreen: undefined;
  EventTag: { tag: string; tagId: number };
  TicketScreen: undefined;
  TicketDetail: { eventId: number; slug: string, regisDate: string };
  ReviewScreen: { eventId: number };
  ScanQR: undefined;
  ContactScreen: undefined;
  ShareProfile: { username: string };
  ScanQrContact: undefined;
  EditProfile: undefined;
  EditSocialMedia: undefined;
  EmailNotificationSetting: undefined;
  ResetPassword: undefined;
  FavoriteEvent: undefined;
};
