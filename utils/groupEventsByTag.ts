import dayjs from "dayjs";

// ฟังก์ชันสำหรับจัดกลุ่ม events ตามวันที่
const groupEventsByTag = (events: any[] = []) => {  // เพิ่มค่า default เป็น array ว่าง
    if (!events || !Array.isArray(events)) {
      
      throw new Error("Expected an array of events");
    }

    const grouped: { [key: string]: any[] } = {};
    const groupedByTags = {};

    events.forEach((event) => {
      event.tags.forEach(tag =>{
        if (!grouped[tag.tag_title]) {
          grouped[tag.tag_title] = [];
          if(grouped[tag.tag_title].length <= 3){
            grouped[tag.tag_title].push(event);
          }        
        } else{
          if(grouped[tag.tag_title].length <= 3){
            grouped[tag.tag_title].push(event);
          }
        }
      })
    });
    console.log("group by tags" + grouped)
    // จัดเรียงวันที่ และจำกัดไว้แค่ 3 วัน

    return grouped
};

export default groupEventsByTag;
