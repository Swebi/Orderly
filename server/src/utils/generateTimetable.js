const generateTimetable = (courses, batch) => {
  const slotMap = {};
  courses.forEach((course) => {
    if (course.slot === "N/A") {
      return;
    }
    const codes = course.slot
      .split(/[-/]+/)
      .filter((code) => code.trim() !== "");
    codes.forEach((code) => {
      const subjectWithRoom = course.roomNumber && course.roomNumber !== "N/A" 
        ? `${course.courseTitle} - ${course.roomNumber}`
        : course.courseTitle;
      slotMap[code] = subjectWithRoom;
    });
  });

  const timetables = {
    1: [
      ["A", "A / X", "F / X", "F", "G", "P6", "P7", "P8", "P9", "P10"],
      ["P11", "P12/X", "P13/X", "P14", "P15", "B", "B", "G", "G", "A"],
      ["C", "C / X", "A / X", "D", "B", "P26", "P27", "P28", "P29", "P30"],
      ["P31", "P32/X", "P33/X", "P34", "P35", "D", "D", "B", "E", "C"],
      ["E", "E / X", "C / X", "F", "D", "P46", "P47", "P48", "P49", "P50"],
    ],
    2: [
      ["P1", "P2/X", "P3/X", "P4", "P5", "A", "A", "F", "F", "G"],
      ["B", "B / X", "G / X", "G", "A", "P16", "P17", "P18", "P19", "P20"],
      ["P21", "P22/X", "P23/X", "P24", "P25", "C", "C", "A", "D", "B"],
      ["D", "D / X", "B / X", "E", "C", "P36", "P37", "P38", "P39", "P40"],
      ["P41", "P42/X", "P43/X", "P44", "P45", "E", "E", "C", "F", "D"],
    ],
  };

  const timetable = timetables[batch] || [];

  const timeSlots = [
    { start: "08:00", end: "08:50" },
    { start: "08:50", end: "09:40" },
    { start: "09:45", end: "10:35" },
    { start: "10:40", end: "11:30" },
    { start: "11:35", end: "12:25" },
    { start: "12:30", end: "13:20" },
    { start: "13:25", end: "14:15" },
    { start: "14:20", end: "15:10" },
    { start: "15:10", end: "16:00" },
    { start: "16:00", end: "16:50" },
  ];

  const result = {};
  timetable.forEach((day, dayIndex) => {
    const dayNumber = dayIndex + 1;
    result[dayNumber] = [];
    day.forEach((slot, slotIndex) => {
      const code = slot.split(/[/\s-]+/)[0].trim();
      result[dayNumber].push({
        start: timeSlots[slotIndex].start,
        end: timeSlots[slotIndex].end,
        subject: slotMap[code] || "",
      });
    });
  });

  return result;
};

export default generateTimetable;
