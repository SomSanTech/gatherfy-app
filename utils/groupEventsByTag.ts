import dayjs from "dayjs";

// ฟังก์ชันสำหรับจัดกลุ่ม events ตามวันที่
const groupEventsByTag = (events: any[] = []) => {  // เพิ่มค่า default เป็น array ว่าง
    if (!events || !Array.isArray(events)) {
      
      throw new Error("Expected an array of events");
    }

    const groupedByTags = {};
    const grouped: { 
      [key: string]: { 
        tag_id: number; 
        tag_title: string; 
        events: any[]; 
      } 
    } = {};

    events.forEach((event) => {
      event.tags.forEach((tag: { tag_id: number; tag_title: string }) =>{
        if (!grouped[tag.tag_title]) {
          grouped[tag.tag_title] = {
            tag_id: tag.tag_id,
            tag_title: tag.tag_title,
            events: []
          };
          if(grouped[tag.tag_title].events.length <= 3){
            grouped[tag.tag_title].events.push(event);
          }        
        } 
        else{
          if(grouped[tag.tag_title].events.length <= 3){
            grouped[tag.tag_title].events.push(event);
          }
        }
      })
    });

    return grouped
};

export default groupEventsByTag;
