import { formatDate } from "../utils/FormatDate";

export const TaskItem = ({ task, onDelete, onToggle }) => (
  <li
    className={`flex items-center justify-between p-3 rounded-xl mb-2 shadow-sm border transition-transform duration-300 transform hover:scale-101 ${task.completed
      ? "bg-[#FF4583]/10 line-through text-gray-500 border-gray-300"
      : "bg-white text-gray-800 border-gray-200"
      }`}
  >
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="w-4 h-4 accent-[#FF8A59]"
      />
      <span>{task.text}</span>
    </div>
    <div className="flex items-center gap-4 text-sm">
      <span className="text-gray-500">{formatDate(task.createdAt)}</span>
      <button
        onClick={() => onDelete(task.id)}
        className="px-2 py-1 bg-[#FFC54C] text-white rounded-lg font-medium"
      >
        Eliminar
      </button>
    </div>
  </li>
)