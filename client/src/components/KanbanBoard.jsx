const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

const KanbanBoard = ({ tasks = [] }) => {
  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => (
        <div key={col.id} className="kanban-column">
          <h3>{col.title}</h3>
          {tasks
            .filter((t) => t.status === col.id)
            .map((task) => (
              <div key={task._id || task.id} className="kanban-card">
                <p>{task.title}</p>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
