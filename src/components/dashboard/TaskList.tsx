import { Card } from "@/components/ui/Card";
import { Task } from "@/types";

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <Card className="p-5 flex flex-col">
      <h3 className="text-ink-dim text-xs uppercase tracking-wider mb-4">Today&apos;s Crop Task</h3>
      {tasks.length > 0 ? (
        <div className="flex flex-col gap-2">
          {tasks.map(task => (
            <div key={task.id} className="flex flex-col">
              <span className="text-ink text-lg">{task.title}</span>
              <span className="text-ink-dim text-sm">{task.subtitle}</span>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-ink-faint italic">No pending tasks for today.</span>
      )}
    </Card>
  );
}