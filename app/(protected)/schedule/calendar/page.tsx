"use client"

import { useSearchParams } from "next/navigation";
import ScheduleForm from "../scheduleForm/page";

export default async function Calendar({params}: any) {
    console.log('params: ', params)
    const searchParams = useSearchParams();
    const barberID = searchParams.get('barberID');
    const productID = searchParams.get('productID');
    return (
        <>
            <div style={{

            }}>
                <ScheduleForm barberID={barberID} productID={productID}/>
            </div>
        </>
    );
}