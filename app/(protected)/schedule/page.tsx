
import { GetStaticPaths, GetStaticProps } from "next";
import ScheduleForm  from "./scheduleForm/page";
import { NextSeo } from "next-seo";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { useIsClient } from "@/hooks/use-is-client";
import Spinner from "@/components/spinner";
import TimeIntervals from "./time-intervals/page";

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

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    };
};

 export const getStaticProps: GetStaticProps = async ({ params }) => {
    console.log(params)
    const id = String(params?.id);

    const user = await db.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            user: {
                name: user.name,
            }
        },
        revalidate: 60 * 60 * 24
    };
};
