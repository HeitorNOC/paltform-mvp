"use client"

import { useState } from "react";
import { CalendarStep } from "./calendarStep/page";
import { ConfirmStep } from "./confirmStep/page";

export default function ScheduleForm({ barberID: id }: any) {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null)
  }

  if (selectedDateTime) {
    return <ConfirmStep schedulingDate={selectedDateTime} onCancelConfirmation={handleClearSelectedDateTime} barberID={id} itemID={30}/>
  } 

   return <CalendarStep onSelectDateTime={setSelectedDateTime} barberID={id}/> 
  
  
}