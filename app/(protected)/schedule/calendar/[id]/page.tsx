import ScheduleForm from "../../scheduleForm/page";

export default async function Calendar({params}: any) {
    return (
        <>
            <div style={{
                maxWidth: 852,
                padding: '0  $4',
                margin: "$20 auto $4",
            }}>
                <ScheduleForm barberID={params.id}/>
            </div>
        </>
    );
}