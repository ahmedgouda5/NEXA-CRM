import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { AvatarChip, PriorityPill, TaskCheck } from '@/domains/crm/components/crm-primitives'
import { useCrmStore } from '@/domains/crm/crm.store'
import type { TaskBucket } from '@/domains/crm/crm.types'

const BUCKETS: TaskBucket[] = ['Today', 'Upcoming', 'Overdue', 'Completed']

export function TasksView() {
  const tasks = useCrmStore((state) => state.tasks)
  const taskBucket = useCrmStore((state) => state.taskBucket)
  const setTaskBucket = useCrmStore((state) => state.setTaskBucket)
  const toggleTask = useCrmStore((state) => state.toggleTask)
  const openCreate = useCrmStore((state) => state.openCreate)

  const rows =
    taskBucket === 'Completed'
      ? tasks.filter((task) => task.done)
      : tasks.filter((task) => !task.done && task.bucket === taskBucket)

  return (
    <section className="view" data-active="true">
      <div className="view-header">
        <div>
          <div className="view-title">Tasks</div>
          <div className="view-sub">Stay on top of every commitment</div>
        </div>
        <div className="view-actions">
          <button className="btn btn-primary" onClick={() => openCreate('task')}>
            <Plus />
            New task
          </button>
        </div>
      </div>

      <div className="task-tabs">
        {BUCKETS.map((bucket) => {
          const count =
            bucket === 'Completed'
              ? tasks.filter((task) => task.done).length
              : tasks.filter((task) => !task.done && task.bucket === bucket).length
          return (
            <button
              key={bucket}
              type="button"
              className={taskBucket === bucket ? 'task-tab active' : 'task-tab'}
              onClick={() => setTaskBucket(bucket)}
            >
              {bucket} · {count}
            </button>
          )
        })}
      </div>

      <div className="card">
        {rows.length === 0 ? (
          <div className="empty-state">Nothing in {taskBucket.toLowerCase()}. Enjoy the quiet.</div>
        ) : (
          rows.map((task) => (
            <div className={task.done ? 'task-row done' : 'task-row'} key={task.id}>
              <TaskCheck checked={task.done} onToggle={() => toggleTask(task.id)} />
              <div className="task-title">{task.title}</div>
              <div className="task-company">{task.company}</div>
              <PriorityPill priority={task.priority} />
              <div className="task-due">{task.due}</div>
              <AvatarChip seed={task.owner} name={task.owner} size="sm" className="task-owner" />
            </div>
          ))
        )}
        <div className="table-foot">
          <span>
            {rows.length} {taskBucket.toLowerCase()} task{rows.length === 1 ? '' : 's'}
          </span>
          <button
            className="chip"
            onClick={() => toast('Task digest sent to your inbox')}
          >
            Email me a digest
          </button>
        </div>
      </div>
    </section>
  )
}
