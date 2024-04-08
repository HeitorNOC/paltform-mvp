
import { GetStaticPaths, GetStaticProps } from "next";
import { ScheduleForm } from "./scheduleForm/page";
import { NextSeo } from "next-seo";
import { db } from "@/lib/db";

interface ScheduleProps {
    user: {
        name: string;
        bio: string;
        avatarUrl: string;
    };
}

export default function Schedule({ user }: ScheduleProps) {
    return (
        <>
            <NextSeo
                title={`Agendar com ${user.name} | Ignite Call`}
            />
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

/* export const getStaticProps: GetStaticProps = async ({ params }) => {
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
}; */
