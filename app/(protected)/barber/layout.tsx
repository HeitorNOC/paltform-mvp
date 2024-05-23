import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Barber",
};

export default function BarberLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex-col items-center justify-center">
      <Toaster
        richColors
        closeButton
      />
      {props.children}
    </div>
  );
}
