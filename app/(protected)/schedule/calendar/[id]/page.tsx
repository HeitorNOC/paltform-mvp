import ScheduleForm from "../../scheduleForm/page";

export default async function Calendar({params}: any) {
    
    return (
        <>
            <div style={{

            }}>
                <ScheduleForm barberID={params.id}/>
            </div>
        </>
    );
}