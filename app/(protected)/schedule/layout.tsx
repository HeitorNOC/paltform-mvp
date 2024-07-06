import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Schedule",
};

export default function ScheduleLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <div >
      <Toaster
        richColors
        closeButton
      />
      {props.children}
    </div>
  );
}