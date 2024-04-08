"use client"

import { startTransition, useEffect, useState } from "react";
import { Calendar } from "@/components/calendar";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { availability as availabilityFn } from "@/actions/availability";

interface Availability {
    possibleTimes: number[];
    availableTimes: number[];
}

interface CalendarStepProps {
    onSelectDateTime: (date: Date) => void;
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availability, setAvailability] = useState<Availability>()
    const [error, setError] = useState<string>("");

    const router = useRouter();

    const isDateSelected = !!selectedDate;

    const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null;
    const describedDate = selectedDate ? dayjs(selectedDate).format("DD[ de ]MMMM") : null;

    const selectedDateWithoutTime = selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : null;

    useEffect(() => {
        onSubmit()
    }, [])

    const onSubmit = () => {
        startTransition(() => {
            try {
                availabilityFn(selectedDateWithoutTime).then((data) => {
                    if (data?.error) {
                        setError(data.error);
                        return
                    }

                    setAvailability(data.success)
                });
            } catch (err) {
                setError(`Something went wrong! Error:${err}`);
            } finally {
                setError("");
            }
        });
    };

    function handleSelectTime(hour: number) {
        const dateWithTime = dayjs(selectedDate).set("hour", hour).startOf("hour").toDate();

        onSelectDateTime(dateWithTime);
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

            {isDateSelected && (
                <div className="border-l border-gray-600 pl-6 overflow-y-scroll">
                    <div className="font-medium">
                        {weekDay} <span className="text-gray-200">{describedDate}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 mt-3">
                        {availability?.possibleTimes.map((hour: any) => (
                            <button
                                key={hour}
                                onClick={() => handleSelectTime(hour)}
                                disabled={!availability.availableTimes.includes(hour)}
                                className="border-0 bg-gray-600 px-2 py-1 cursor-pointer text-gray-100 rounded-sm text-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-100"
                            >
                                {String(hour).padStart(2, "0")}:00h
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
