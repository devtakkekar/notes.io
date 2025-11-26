import { useEffect, useRef, useState } from 'react';
import NoteItem from './NoteItem';
import EmptyState from './EmptyState';

const NotesSidebar = ({
  notes,
  activeId,
  onSelect,
  onAddNote,
  onDeleteNote,
  view,
  onChangeView,
  disableAdd,
  onStartSelection,
  isSelecting,
  selectedIds,
  selectionActionLabel,
  onToggleSelection,
  onCancelSelection,
  onApplySelection,
  selectionActionType,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const actionsRef = useRef(null);

  useEffect(() => {
    const handleClickAway = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    return () => document.removeEventListener('mousedown', handleClickAway);
  }, []);

  const menuOptions =
    view === 'archive'
      ? [
          { id: 'unarchive', label: 'Unarchive' },
          { id: 'delete', label: 'Delete' },
        ]
      : [
          { id: 'archive', label: 'Archive' },
          { id: 'delete', label: 'Delete' },
        ];

  const hasSelection = selectedIds.length > 0;

  const handleMenuAction = (actionId) => {
    setMenuOpen(false);
    onStartSelection(actionId);
  };

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <h1 className="logo">notes.io</h1>
        <div className="sidebar-actions" ref={actionsRef}>
          <button
            type="button"
            className="icon-button icon-plus"
            aria-label="New note"
            onClick={onAddNote}
            disabled={disableAdd}
          >
            <span>+</span>
          </button>
          <button
            type="button"
            className="icon-button icon-more"
            aria-label="More options"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            disabled={isSelecting}
          >
            <span>⋮</span>
          </button>
          {menuOpen && (
            <div className="action-menu" role="menu">
              {menuOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleMenuAction(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>
      <div className={`panel-tabs ${view}`} role="tablist" aria-label="Note collections">
        <button
          type="button"
          className={view === 'current' ? 'active' : ''}
          onClick={() => onChangeView('current')}
        >
          Current
        </button>
        <button
          type="button"
          className={view === 'archive' ? 'active' : ''}
          onClick={() => onChangeView('archive')}
        >
          Archive
        </button>
      </div>
      <div className={`panel-body ${view}`}>
        <div className="notes-list">
          {notes.length === 0 ? (
            <EmptyState
              message={
                view === 'archive'
                  ? 'Archive is empty. Move notes here to store them.'
                  : 'No notes yet. Create your first thought.'
              }
            />
          ) : (
            notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={note.id === activeId}
                isSelected={selectedIds.includes(note.id)}
                isSelecting={isSelecting}
                onSelect={() =>
                  isSelecting ? onToggleSelection(note.id) : onSelect(note.id)
                }
                onDelete={() => onDeleteNote(note.id)}
                disableDelete={isSelecting}
              />
            ))
          )}
        </div>
        {isSelecting && (
          <div className="bulk-actions">
            <button type="button" className="bulk-btn cancel" onClick={onCancelSelection}>
              Cancel
            </button>
            <button
              type="button"
              className={`bulk-btn apply ${
                hasSelection && selectionActionType ? selectionActionType : 'disabled'
              }`}
              onClick={onApplySelection}
              disabled={!hasSelection}
              aria-disabled={!hasSelection}
            >
              {selectionActionLabel}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default NotesSidebar;

