import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimetableForm from "../components/TimetableForm";
import Timetable from "../components/Timetable";
import axiosInstance from "../lib/axios";

const Dashboard = () => {
  const [timetable, setTimetable] = useState([]);
  const [dayOrder, setDayOrder] = useState(null);
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState([]);

  const getTimetable = async () => {
    const { data } = await axiosInstance.get("/api/timetable");
    setTimetable(data.data.timetable);
  };

  const getDayOrder = async () => {
    const { data } = await axiosInstance.get("/api/dayorder");
    setDayOrder(data.data);
  };

  const createCalendar = async () => {
    await axiosInstance.post("/api/calendar");
  };

  useEffect(() => {
    getTimetable();
    getDayOrder();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && subjectInput.trim()) {
      setSubjects((prevSubjects) => [...prevSubjects, subjectInput.trim()]);
      setSubjectInput("");
    }
  };

  const removeSubject = (remove) => {
    const filtered = subjects.filter((subject) => subject !== remove);
    setSubjects(filtered);
  };

  return (
    <div className="w-[95%] md:w-[60%] min-h-screen flex flex-col gap-2 justify-start mx-auto items-center p-8">
      <h1 className="self-start font-semibold text-xl mb-4">
        Today's Day Order: {dayOrder}
      </h1>

      <div className="w-full mb-4">
        <Input
          value={subjectInput}
          onKeyDown={handleKeyDown}
          placeholder="Add your subjects (press Enter to add)"
          type="text"
          onChange={(e) => setSubjectInput(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {subjects.map((subject) => (
          <span
            key={subject}
            className="bg-black text-white px-3 py-1.5 rounded-lg"
            onClick={() => {
              removeSubject(subject);
            }}
          >
            {subject}
          </span>
        ))}
      </div>

      <Tabs defaultValue="timetable" className="w-full">
        <TabsList className="grid w-full grid-cols-2 my-3">
          <TabsTrigger value="timetable">Your Timetable</TabsTrigger>
          <TabsTrigger value="form">Edit Timetable</TabsTrigger>
        </TabsList>
        <TabsContent value="timetable">
          <Timetable timetable={timetable} />
        </TabsContent>
        <TabsContent value="form">
          <TimetableForm subjects={subjects} />
        </TabsContent>
      </Tabs>

      <Button onClick={createCalendar} className="mt-4">
        Create Calendar
      </Button>
    </div>
  );
};

export default Dashboard;
