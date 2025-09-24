
'use client'
import TaskBoard from "./components/tasks";
import { FiPlus } from "react-icons/fi";
import { useDisclosure } from "@mantine/hooks";
import { Button } from "@/app/components/ui/button";
import TaskForm from "./components/task-form";
import { useState } from "react";
import { Tasks } from "./types";

const AddTask = () => {
    const [isOpen, { open, close }] = useDisclosure();

    return (
        <div>
            <Button onClick={open} leftIcon={<FiPlus />}>
                {('Create Task')}
            </Button>
            {isOpen && <TaskForm isOpen={isOpen} close={close} />}
        </div>
    );
};

export default function Home() {
    const [editOpen, { open: openEdit, close: closeEdit }] = useDisclosure(false);
    const [editing, setEditing] = useState<Tasks | undefined>(undefined);
  
    const onEdit = (task: Tasks) => {
      setEditing(task);
      openEdit();
    };

    return <div>
        <div className="flex justify-end mt-5 p-5">
            <AddTask />
        </div>

        <TaskBoard onEdit={onEdit} />
        
        {editOpen && (
        <TaskForm isOpen={editOpen} close={closeEdit} oldData={editing} />
      )}

    </div>;
}