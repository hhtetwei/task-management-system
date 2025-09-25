'use client'
import TaskBoard from "./components/tasks";
import { FiPlus } from "react-icons/fi";
import { useDisclosure } from "@mantine/hooks";
import { Button } from "@/app/components/ui/button";
import TaskForm from "./components/task-form";
import { useState } from "react";
import { Priority, Status, Tasks } from "./types";
import DeleteTask from "./components/delete-task";
import { useFilterTasks } from "./hooks/useFilterTasks";
import { Select } from "@/app/components/ui/select";

const AddTask = () => {
    const [isOpen, { open, close }] = useDisclosure();

    return (
        <div>
            <Button onClick={open} leftIcon={<FiPlus />}>
                Create Task
            </Button>
            {isOpen && <TaskForm isOpen={isOpen} close={close} />}
        </div>
    );
};

const formatStatusLabel = (status: string) => {
  switch (status) {
    case 'TODO': return 'To Do';
    case 'IN_PROGRESS': return 'In Progress';
    case 'DONE': return 'Done';
    default: return status;
  }
};

export default function Home() {
    const [editOpen, { open: openEdit, close: closeEdit }] = useDisclosure(false);
    const [delOpen, { open: openDel, close: closeDel }] = useDisclosure(false);
    
    const [editing, setEditing] = useState<Tasks | undefined>(undefined);
    const [deleting, setDeleting] = useState<Tasks | undefined>(undefined);
  
    const { status, priority, search, filterByStatus, filterByPriority, clearFilters } = useFilterTasks();

    console.log({ status, priority, search });

    const onEdit = (task: Tasks) => { setEditing(task); openEdit(); };
    const onDelete = (task: Tasks) => { setDeleting(task); openDel(); };

    const statusOptions = [
        { label: 'All Statuses', value: 'ALL' },
        ...Object.values(Status).map((type) => ({ 
            label: formatStatusLabel(type), 
            value: type 
        }))
    ];

    const priorityOptions = [
        { label: 'All Priorities', value: '' },
        ...Object.values(Priority).map((type) => ({ 
            label: type, 
            value: type 
        }))
    ];

    return (
        <div>
            <div className="flex justify-between items-center mt-5 p-5">
                <div className="flex gap-3 flex-wrap">
                    <Select
                        data={statusOptions}
                        placeholder="Filter by Status"
                        value={status || 'ALL'}
                        onChange={(v) => filterByStatus(v)}
                        clearable
                        className="min-w-[200px]"
                    />

                    <Select
                        data={priorityOptions}
                        placeholder="Filter by Priority"
                        value={priority || ''}
                        onChange={(v) => filterByPriority(v)}
                        clearable
                        className="min-w-[200px]"
                    />

                    {(status !== 'ALL' || priority || search) && (
                        <Button
                            variant="subtle"
                            onClick={clearFilters}
                            className="min-w-[100px]"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
                
                <div className="ml-3">
                    <AddTask />
                </div>
            </div>

            <TaskBoard onEdit={onEdit} onDelete={onDelete} />
            
            {editOpen && (
                <TaskForm isOpen={editOpen} close={closeEdit} oldData={editing} />
            )}
            
            {delOpen && (
                <DeleteTask isOpen={delOpen} close={closeDel} task={deleting} />
            )}
        </div>
    );
}