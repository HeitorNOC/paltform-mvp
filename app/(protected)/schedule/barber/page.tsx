"use client"

import { startTransition, useEffect, useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../../../components/ui/carousel";
import { ROLES } from "../../_constants";
import { listUsers } from "../../../../actions/user";
import { User } from "../../../../types/next-auth";
import Spinner from "../../../../components/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { Button } from "../../../../components/ui/button";
import { useRouter } from "next/navigation";

export default function ChooseBarber() {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true)
    const [barbers, setBarbers] = useState<Array<User>>()

    const router = useRouter()

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        setLoading(true)
        startTransition(() => {
            try {
                listUsers(ROLES.BARBER).then((data: any) => {
                    if (data?.error) {
                        setError(data.error)
                        return
                    } else if (data.users) {
                        setBarbers(data.users)
                    }
                })
            } catch (err) {
                setError(`Something went wrong! Error:${err}`)
            } finally {
                setError("")
            }
            setLoading(false)
        })
    }

    const handleNavigateToCalendar= (barberID: string) => {
        const encodedBarberID = btoa(barberID)
        
        router.push(`/schedule/calendar/${encodedBarberID}`)
    }

    return loading ? <Spinner /> : (
        <div>
            {
                barbers && barbers.length > 0 ? (
                    <Carousel className="w-full max-w-xs">
                        <CarouselContent>
                            {Array.from({ length: barbers.length }).map((_, index) => (
                                <CarouselItem key={index} className="basis-4/5">
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="flex flex-col aspect-square items-center justify-center gap-4">
                                                <div className="gap-2 flex items-center justify-center">
                                                    <Avatar>
                                                        <AvatarImage src={barbers[index].image || ""} width={200} height={200} />
                                                        <AvatarFallback className="bg-sky-400 text-primary-foreground">
                                                            <FaUser className="h-6 w-6" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xl font-semibold">{barbers[index].name}</span>
                                                </div>
                                                <div className="gap-2 flex flex-col items-center justify-center">
                                                    <Button onClick={() => console.log("barber details", barbers[index].id)}>Detalhes</Button>
                                                    <Button onClick={() => handleNavigateToCalendar(barbers[index].id as string)}>Selecionar</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                ) : (
                    <div>
                        Não foram encontrados barbeiros
                    </div>
                )
            }

        </div>
    )
}