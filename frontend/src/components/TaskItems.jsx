import { formatDate } from "../utils/FormatDate";

export const TaskItem = ({ task, onDelete, onToggle }) => (
  <li
    className={`flex items-center justify-between p-3 rounded-2xl mb-2 shadow-sm border backdrop-filter backdrop-blur-lg bg-white/30 border-white/30 transition-transform duration-300 transform hover:scale-101 ${task.completed
      ? "line-through text-gray-500"
      : "text-gray-800 font-medium"
      }`}
  >
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task._id)}
        className="w-4 h-4 accent-[#FF8A59]"
      />
      <span>{task.text}</span>
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
