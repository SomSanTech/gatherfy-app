import dayjs from "dayjs";

// ฟังก์ชันสำหรับจัดกลุ่ม events ตามวันที่
const groupEventsByDate = (events: any[] = []) => {  // เพิ่มค่า default เป็น array ว่าง
    if (!events || !Array.isArray(events)) {
      
      throw new Error("Expected an array of events");
    }

    const grouped: { [key: string]: any[] } = {};

    events.forEach((event) => {
      const date = dayjs(event.start_date).format("YYYY-MM-DD");

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });

    // จัดเรียงวันที่ และจำกัดไว้แค่ 3 วัน
    return Object.entries(grouped)
      .filter(([date]) => dayjs(date).isSame(dayjs(), 'day') || dayjs(date).isAfter(dayjs(), 'day')) // Only today or after
      .sort(([dateA], [dateB]) => dayjs(dateA).unix() - dayjs(dateB).unix()) // Sort from present to future
      .slice(0, 4)
      .reduce((acc, [date, events]) => {
        acc[date] = events;
        return acc;
      }, {} as { [key: string]: any[] });
};

export default groupEventsByDate;
