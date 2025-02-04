import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { days, hours } from "../data/data";

export const Timetable = ({ timetable }) => {
  return (
    <div className="flex max-w-7xl w-full mt-6  mx-auto overflow-x-auto bg-white">
      <Table className="shadow-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="border">Day</TableHead>
            {hours.map((hour, index) => (
              <TableHead className="border text-pretty py-6" key={index}>
                {hour}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {days.map((day, dayIndex) => (
            <TableRow key={dayIndex}>
              <TableCell className="font-medium border min-w-20 py-6">
                {day}
              </TableCell>
              {hours.map((_, hourIndex) => {
                const slot = timetable[dayIndex + 1][hourIndex];
                return (
                  <TableCell className="border min-w-20" key={hourIndex}>
                    {slot && (
                      <div className="text-center">
                        <div className="font-semibold">{slot.subject}</div>
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Timetable;
