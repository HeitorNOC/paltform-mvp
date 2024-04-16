"use client"

import { startTransition, useEffect, useState } from "react";
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useMemo } from "react";
import { getWeekDays } from "@/utils/get-week-days";
import dayjs from "dayjs";
import { Button } from "./ui/button";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "./ui/table";
import { blockedDates as blockedDatesFn } from "@/actions/blocked-dates";
import 'dayjs/locale/pt-br'
import Spinner from "./spinner";

dayjs.locale('pt-br')
interface CalendarWeek {
    week: number;
    days: Array<{
        date: dayjs.Dayjs;
        disabled: boolean;
    }>;
}

type CalendarWeeks = CalendarWeek[];

interface BlockedDates {
    blockedWeekDays: number[];
    blockedDates: number[];
}

interface CalendarProps {
    selectedDate: Date | null;
    onDateSelected: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs().set("date", 1);
    });
    const [error, setError] = useState<string>("");
    const [blockedDates, setBlockedDates] = useState<BlockedDates>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        createComponent()
    }, [])

    const createComponent = () => {
        startTransition(() => {
            try {
                blockedDatesFn(currentDate.get('year'), currentDate.get('month')).then((data) => {
                    if (data?.error) {
                        setError(data.error);
                        return
                    }
                    else if (data.blockedDates && data.blockedWeekDays) {
                        setBlockedDates({ blockedDates: data.blockedDates, blockedWeekDays: data.blockedWeekDays })
                    }
                });
            } catch (err) {
                setError(`Something went wrong! Error:${err}`);
            } finally {
                setLoading(false)
            }
        });
    };

    function handlePreviousMonth() {
        const previousMonth = currentDate.subtract(1, "month");

        setCurrentDate(previousMonth);
    }

    function handleNextMonth() {
        const nextMonth = currentDate.add(1, "month");

        setCurrentDate(nextMonth);
    }

    const shortWeekDays = getWeekDays({ short: true });

    const currentMonth = currentDate.format("MMMM");
    const currentYear = currentDate.format("YYYY");

    const calendarWeeks = useMemo(() => {
        if (!blockedDates) {
            return [];
        }

        const daysInMonthArray = Array.from({
            length: currentDate.daysInMonth(),
        }).map((_, i) => {
            return currentDate.set("date", i + 1);
        });

        const firstWeekDay = currentDate.get("day");

        const previousMonthFillArray = Array.from({
            length: firstWeekDay,
        })
            .map((_, i) => {
                return currentDate.subtract(i + 1, "day");
            })
            .reverse();

        const lastDayInCurrentMonth = currentDate.set(
            "date",
            currentDate.daysInMonth()
        );
        const lastWeekDay = lastDayInCurrentMonth.get("day");

        const nextMonthFillArray = Array.from({
            length: 7 - (lastWeekDay + 1),
        }).map((_, i) => {
            return lastDayInCurrentMonth.add(i + 1, "day");
        });

        const calendarDays = [
            ...previousMonthFillArray.map((date) => {
                return { date, disabled: true };
            }),
            ...daysInMonthArray.map((date) => {
                return {
                    date,
                    disabled:
                        date.endOf("day").isBefore(new Date()) ||
                        blockedDates.blockedWeekDays.includes(date.get("day")) ||
                        blockedDates.blockedDates.includes(date.get("date")),
                };
            }),
            ...nextMonthFillArray.map((date) => {
                return { date, disabled: true };
            }),
        ];

        const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
            (weeks, _, i, original) => {
                const isNewWeek = i % 7 === 0;

                if (isNewWeek) {
                    weeks.push({
                        week: i / 7 + 1,
                        days: original.slice(i, i + 7),
                    });
                }
                return weeks;
            },
            []
        );

        return calendarWeeks;
    }, [currentDate, blockedDates]);

    return loading ? <Spinner /> : (
        <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
                <h2>
                    {currentMonth} <span>{currentYear}</span>
                </h2>
                <div>
                    <Button
                        onClick={handlePreviousMonth}
                        title="Previous month"
                        variant="ghost"
                    >
                        <CaretLeft />
                    </Button>
                    <Button onClick={handleNextMonth} title="Next month" variant="ghost">
                        <CaretRight />
                    </Button>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        {shortWeekDays.map((weekDay: any) => (
                            <TableCell key={weekDay}>
                                <span className="text-gray-200 font-medium text-sm">
                                    {weekDay}.
                                </span>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {calendarWeeks.map(({ week, days }) => {
                        return (
                            <TableRow key={week}>
                                {days.map(({ date, disabled }) => {
                                    return (
                                        <TableCell key={date.toString()}>
                                            <Button
                                                onClick={() => onDateSelected(date.toDate())}
                                                disabled={disabled}
                                                variant="ghost"
                                                className="w-full aspect-w-1 aspect-h-1 bg-gray-600 text-center cursor-pointer rounded-sm"
                                            >
                                                <span className="text-white">
                                                    {date.get("date")}
                                                </span>
                                            </Button>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
