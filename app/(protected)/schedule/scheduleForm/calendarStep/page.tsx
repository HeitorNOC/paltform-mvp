"use client"

import { startTransition, useEffect, useState } from "react";
import { Calendar } from "@/components/calendar";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br'

import { availability as availabilityFn } from "@/actions/availability";
import Spinner from "@/components/spinner";

dayjs.locale('pt-br')
interface Availability {
    possibleTimes: number[];
    availableTimes: number[];
}

interface CalendarStepProps {
    onSelectDateTime: (date: Date) => void;
    barberID: string
}

export function CalendarStep({ onSelectDateTime, barberID }: CalendarStepProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availability, setAvailability] = useState<Availability>()
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false)

    const isDateSelected = !!selectedDate;

    const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null;
    const describedDate = selectedDate ? dayjs(selectedDate).format("DD[ de ]MMMM") : null;
    const selectedDateWithoutTime = selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : null;
    useEffect(() => {
        if (!!selectedDate) {
            onSelectDate()
        }
    }, [selectedDate])
    const onSelectDate = () => {
        setLoading(true)
        startTransition(() => {
            try {
                const decodedURI = decodeURIComponent(barberID)
                const decodedID = atob(decodedURI)
                availabilityFn(selectedDateWithoutTime, decodedID).then((data: any) => {
                    if (data?.error) {
                        setError(data.error);
                        return
                    } else if (data.availableTimes && data.possibleTimes) {
                        setAvailability({ availableTimes: data.availableTimes, possibleTimes: data.possibleTimes })
                    }
                });
            } catch (err) {
                setError(`Something went wrong! Error:${err}`);
            } finally {
                setError("");
            }
            setLoading(false)
        });
    };

    function handleSelectTime(hour: number) {
        const dateWithTime = dayjs(selectedDate).set("hour", hour).startOf("hour").toDate();

        onSelectDateTime(dateWithTime);
    }

    return (
        <div className={`grid p-0 relative mt-6 mb-0 mx-auto min-w-max ${selectedDate ? 'grid-cols-1 sm:grid-cols-2' : 'sm:w-540px grid-cols-1'}`}>
            <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} barberID={barberID}/>

            {isDateSelected && (
                <div className={`sm:col-span-1 overflow-y-scroll px-2 ${selectedDate ? 'col-span-full ml-4' : 'hidden'}`}>
                    <div className="font-medium">
                        {weekDay} <span className="text-gray-200">{describedDate}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 mt-3">
                        {
                            loading ? <Spinner /> : (
                                <>
                                    {availability?.possibleTimes.map((hour: any) => (
                                        <button
                                            key={hour}
                                            onClick={() => handleSelectTime(hour)}
                                            className={`border-0 bg-gray-600 px-2 py-1 cursor-pointer text-gray-100 rounded-sm text-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-100 ${!availability.availableTimes.includes(hour) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={!availability.availableTimes.includes(hour)}
                                        >
                                            {String(hour).padStart(2, "0")}:00h
                                        </button>
                                    ))}
                                </>
                            )
                        }
                    </div>
                </div>
            )}
        </div>

    );
}
