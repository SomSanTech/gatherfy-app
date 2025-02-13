const RootStackParamList = {
    HomeScreen: undefined,
    EventDetail: { slug: 'string' }, // Ensure the params match your logic
    SearchScreen: undefined,
    ProfileScreen: undefined,
    TagScreen: undefined,
    EventTag: { tag: 'string' }, // Ensure the params match your logic
    TicketScreen: undefined,
    TicketDetail: { ticketId: 'string' }, // Ensure the params match your logic
    ReviewScreen: { eventId: 'number' }, // Ensure the params match your logic
    ScanQR: undefined,
  };
  
  export default RootStackParamList;