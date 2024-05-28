"use client"

import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";

export default function Schedule() {

    const router = useRouter()
    
    return (
        <div>
            <h2>Deseja marcar um horário?</h2>
            <p>Será necessário selecionar um barbeiro antes.</p>
            <Button onClick={() => router.push('/schedule/barber')}>Selecionar Barbeiro</Button>
        </div>
    );
}