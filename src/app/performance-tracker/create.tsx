"use client"
import "./../globals.css"
import { Dayjs } from 'dayjs';
import AddWorkItemModal from "../../../components/performancetracker/workitemmodal";
import React, { useEffect, useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, differenceInMinutes, addWeeks, subWeeks } from 'date-fns';
import { Button, Container, Typography, Box } from '@mui/material';
import { addPerformance } from "@/data/perfomance";
import { PerfomanceCreate } from "@/interfaces/performance";
import { useSession } from "next-auth/react";
import { WorkItemsPerDay } from "../../../components/performancetracker/workItemsPerDay";
import { CircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { ToastNotificationSuccess, ToastNotificationError } from "../../../components/misc/ToastNotification";
import { useUserContext } from "@/context/userContext";

interface WorkItem {
  day: Date;
  startTime: Dayjs;
  endTime: Dayjs;
  project: string;
  totalHours: number;
  tags: string;
  summary: string;
}

const WorkItems = () => {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);
  const [errorToastOpen, setErrorToastOpen] = useState(false)
  const [errorToastMessage, setErrorToastMessage] = useState("")
  const [successToastOpen, setSuccessToastOpen] = useState(false)
  const [successToastMessage, setSuccessToastMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const {organisationid,username} = useUserContext()

  const startOfWeekDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const daysOfWeek = eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate }).filter(
    (day) => day.getDay() !== 0 && day.getDay() !== 6
  );

  const handleAddItem = (project: string, startTime: Dayjs, endTime: Dayjs, tags: string, summary: string) => {
    if (selectedDay) {
      const totalHours = differenceInMinutes(new Date(endTime.toISOString()), new Date(startTime.toISOString())) / 60;
      const newItem: WorkItem = { day: selectedDay, project, startTime, endTime, totalHours, tags, summary };
      const performance: PerfomanceCreate = {
        date: selectedDay.toISOString(),
        project: project,
        starttime: startTime.toISOString(),
        endtime: endTime.toISOString(),
        totalhours: totalHours.toString(),
        tags: tags,
        summary: summary,
        username: username,
        organisation: organisationid
      }
      setIsSaving(true)
      try {
        addPerformance(performance)
        console.log(performance)
        setWorkItems([...workItems, newItem]);
        setRefetchTrigger(prev => prev + 1);
        setSuccessToastMessage("Work item saved successfully");
        setSuccessToastOpen(true)
      } catch (error) {
        setErrorToastMessage((error as Error).message);
        setErrorToastOpen(true)
      } finally {
        setIsSaving(false)
      }
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };
  const handleToastClick = () => {
    setSuccessToastOpen(false);
    setErrorToastOpen(false)
  }
  useEffect(()=>{
    console.log("Create page")
  },[])

  return (
    <Container>
      {isSaving ? (<CircularProgressSpinner message="Saving" />) : (
        <>
          <ToastNotificationSuccess message={successToastMessage} isOpen={successToastOpen} handleClick={handleToastClick} duration={4000} />
          <ToastNotificationError message={errorToastMessage} isOpen={errorToastOpen} handleClick={handleToastClick} duration={4000} />
          <div>
            <Button variant="contained" onClick={handlePreviousWeek} sx={{ marginRight: 2 }}>Previous Week</Button>
            <Button variant="contained" onClick={handleNextWeek}>Next Week</Button>
          </div>
          <div>
            {daysOfWeek.map((day) => (
              <div key={day.toISOString()} className='day'>
                <Typography sx={{fontWeight:"bold"}} variant="h6" component="h2">{format(day, 'EEEE, MMM d, yyyy')}</Typography>
                <Button variant="contained" onClick={() => { setSelectedDay(day); setModalIsOpen(true); }}>
                  Add Item
                </Button>
                <Box>
                  <WorkItemsPerDay username={username} date={day.toDateString()} refetchTrigger={refetchTrigger} organisation={organisationid} />
                </Box>
              </div>
            ))}
          </div>
          {selectedDay && (
            <AddWorkItemModal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              onAddItem={handleAddItem}
              organisation={organisationid}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default WorkItems;
