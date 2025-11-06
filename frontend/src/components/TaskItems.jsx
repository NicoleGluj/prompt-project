import { formatDate } from "../utils/FormatDate";

export const TaskItem = ({ task, onDelete, onToggle }) => (
  <li
    className={`flex items-center justify-between p-3 rounded-2xl mb-2 shadow-sm border backdrop-filter backdrop-blur-lg bg-white/30 border-white/30 
  transition-all duration-500 transform hover:scale-101`}
  >
    <div className={`${task.completed
      ? "line-through text-white"
      : "text-white font-medium"
      }`} >
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task._id)}
          className="hidden"
        />
        <span className={`w-5 h-5 flex items-center justify-center border-1 rounded-md transition-all
      ${task.completed ? 'bg-[#FF8A59] border-[#FF8A59]' : 'bg-white/70 border-gray-300'}`}>
          {task.completed && (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <span>{task.text}</span>
      </label>
    </div>
    <div className="flex items-center gap-4 text-sm">
      <span className="text-gray-500 font-normal">{formatDate(task.createdAt)}</span>
      <button
        onClick={() => onDelete(task._id)}
        className="px-2.5 py-1.5 text-[#0e77c2] font-semibold bg-white/80 rounded-lg "
      >
        Eliminar
      </button>
    </div>
  </li>
)
