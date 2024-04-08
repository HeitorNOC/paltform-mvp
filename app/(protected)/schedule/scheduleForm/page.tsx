"use client"

import { useState } from "react";
import { CalendarStep } from "./calendarStep/page";
import { ConfirmStep } from "./confirmStep/page";

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null)
  }

  if (selectedDateTime) {
    return <ConfirmStep schedulingDate={selectedDateTime} onCancelConfirmation={handleClearSelectedDateTime}/>
  }

  return <CalendarStep onSelectDateTime={setSelectedDateTime}/>
  
}