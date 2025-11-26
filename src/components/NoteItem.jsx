const formatDate = (timestamp) =>
  new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(
    new Date(timestamp)
  );

const NoteItem = ({
  note,
  isActive,
  isSelected,
  isSelecting,
  onSelect,
  onDelete,
  disableDelete,
}) => (
  <button
    type="button"
    className={`note-item ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''} ${
      isSelecting ? 'selecting' : ''
    }`}
    onClick={onSelect}
  >
    <div className="note-meta">
      <strong>{note.title || 'Untitled'}</strong>
      <span>{formatDate(note.updatedAt)}</span>
    </div>
    <p>{note.content ? note.content.slice(0, 80) : 'Start typing to add content…'}</p>
    <span
      className={`note-delete ${disableDelete ? 'disabled' : ''}`}
      role="button"
      tabIndex={disableDelete ? -1 : 0}
      onClick={(event) => {
        event.stopPropagation();
        if (disableDelete) return;
        onDelete();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!disableDelete) onDelete();
        }
      }}
      aria-disabled={disableDelete}
    >
      ×
    </span>
  </button>
);

export default NoteItem;

