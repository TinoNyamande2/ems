"use client"
import "./../globals.css"
import { Dayjs } from 'dayjs';
import AddWorkItemModal from "../../../components/workitemmodal";
import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, differenceInMinutes, addWeeks, subWeeks } from 'date-fns';
import { Button, Container, Typography,Box } from '@mui/material';
import { addPerformance } from "@/data/perfomance";
import { PerfomanceCreate } from "@/interfaces/performance";
import { useSession } from "next-auth/react";
import { WorkItemsPerDay } from "../../../components/workItemsPerDay";

interface WorkItem {
  day: Date;
  startTime: Dayjs;
  endTime: Dayjs;
  project: string;
  totalHours: number;
  tags: string;
  summary: string;
}

const WorkItems: React.FC = () => {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { data: session } = useSession();


  const startOfWeekDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const daysOfWeek = eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate }).filter(
    (day) => day.getDay() !== 0 && day.getDay() !== 6
  );

  const handleAddItem = (project: string, startTime: Dayjs, endTime: Dayjs, tags: string, summary: string) => {
    if (selectedDay) {
      const totalHours = differenceInMinutes(new Date(endTime.toISOString()), new Date(startTime.toISOString())) / 60;
      //const totalHours = 10
      const newItem: WorkItem = { day: selectedDay, project, startTime, endTime, totalHours, tags, summary };
      const performance: PerfomanceCreate = {
        date: selectedDay.toISOString(),
        project: project,
        starttime: startTime.toISOString(),
        endtime: endTime.toISOString(),
        totalhours: totalHours.toString(),
        tags: tags,
        summary: summary,
        username: session?.user?.name
      }
      try {
        addPerformance(performance)
        setWorkItems([...workItems, newItem]);
      } catch (error) {
        console.log(error)
      }

    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>Employee Work Items</Typography>
      <div>
        <Button variant="contained" onClick={handlePreviousWeek} sx={{ marginRight: 2 }}>Previous Week</Button>
        <Button variant="contained" onClick={handleNextWeek}>Next Week</Button>
      </div>
      <div>
        {daysOfWeek.map((day) => (
          <div key={day.toISOString()} className='day'>
            <Typography variant="h6" component="h2">{format(day, 'EEEE, MMM d, yyyy')}</Typography>
            <Button variant="contained" onClick={() => { setSelectedDay(day); setModalIsOpen(true); }}>
              Add Item
            </Button>
            <Box>
              <WorkItemsPerDay date={day.toDateString()} />
            </Box>
            {/* <ul>
              {workItems
                .filter((item) => item.day.toDateString() === day.toDateString())
                .map((item, index) => (
                  <li key={index}>
                    {item.project}: {item.startTime.format('HH:mm')} - {item.endTime.format("HH:mm")} ({item.totalHours.toFixed(2)} hours)
                  </li>
                ))}
            </ul> */}
          </div>
        ))}
      </div>
      {selectedDay && (
        <AddWorkItemModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          onAddItem={handleAddItem}
        />
      )}
    </Container>
  );
};

export default WorkItems;
