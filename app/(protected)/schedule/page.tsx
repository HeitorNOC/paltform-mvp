
import { GetStaticPaths, GetStaticProps } from "next";
import ScheduleForm  from "./scheduleForm/page";
import { NextSeo } from "next-seo";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { useIsClient } from "@/hooks/use-is-client";
import Spinner from "@/components/spinner";
import TimeIntervals from "../barber/time-intervals/page";

export default async function Schedule() {
    const user = await currentUser();

    return (
        <>
            
            <div style={{
                maxWidth: 852,
                padding: '0  $4',
                margin: "$20 auto $4",
            }}>
                <ScheduleForm />
            </div>
        </>
    );
}