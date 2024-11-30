const formatDate = (dateString: string , shortMonth: boolean = false , shortDay: boolean = true): { date: string; time: string } => {
    try {
      const date = new Date(dateString);

      // Custom formatted date
  
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const shortDaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December",
      ];
      const shortMonthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const dayOfWeek = shortDay ? shortDaysOfWeek[date.getDay()] : daysOfWeek[date.getDay()];
      const day = date.getDate();
      const month = shortMonth ? shortMonthNames[date.getMonth()] : monthNames[date.getMonth()];
      const year = date.getFullYear(); // Full year

      const formattedDate = `${dayOfWeek} ${day} ${month} ${year}`;

      // Time in HH:MM AM/PM format
      const hours = date.getHours();
      const minutes = date.getMinutes();

      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      return { date: formattedDate, time: formattedTime };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { date: "Invalid date", time: "" };
    }
  };

  export default formatDate;