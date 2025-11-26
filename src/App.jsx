import { useEffect, useMemo, useState } from 'react';
import NotesSidebar from './components/NotesSidebar';
import NoteEditor from './components/NoteEditor';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

const generateId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Date.now().toString();

const createNote = (overrides = {}) => ({
  id: generateId(),
  title: 'Untitled',
  content: '',
  updatedAt: Date.now(),
  archived: false,
  ...overrides,
});

const actionLabels = {
  archive: 'Archive',
  unarchive: 'Unarchive',
  delete: 'Delete',
};

const App = () => {
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [activeId, setActiveId] = useState(null);
  const [view, setView] = useState('current');
  const [selectionMode, setSelectionMode] = useState({ action: null, ids: [] });

  const visibleNotes = useMemo(
    () => notes.filter((note) => (view === 'archive' ? !!note.archived : !note.archived)),
    [notes, view]
  );

  useEffect(() => {
    if (visibleNotes.length === 0) {
      setActiveId(null);
      return;
    }

    if (!activeId || !visibleNotes.some((note) => note.id === activeId)) {
      setActiveId(visibleNotes[0].id);
    }
  }, [visibleNotes, activeId]);

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeId) || null,
    [notes, activeId]
  );

  const addNote = () => {
    if (view === 'archive') return;
    const newNote = createNote();
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
  };

  const deleteNote = (noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  const updateNote = (field, value) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeId ? { ...note, [field]: value, updatedAt: Date.now() } : note
      )
    );
  };

  const startSelection = (action) => {
    setSelectionMode({ action, ids: [] });
  };

  const toggleSelection = (noteId) => {
    setSelectionMode((prev) => {
      if (!prev.action) return prev;
      const exists = prev.ids.includes(noteId);
      return {
        ...prev,
        ids: exists ? prev.ids.filter((id) => id !== noteId) : [...prev.ids, noteId],
      };
    });
  };

  const cancelSelection = () => setSelectionMode({ action: null, ids: [] });

  const applySelection = () => {
    if (!selectionMode.action || selectionMode.ids.length === 0) return;
    const ids = new Set(selectionMode.ids);
    setNotes((prev) => {
      if (selectionMode.action === 'delete') {
        return prev.filter((note) => !ids.has(note.id));
      }
      if (selectionMode.action === 'archive') {
        return prev.map((note) =>
          ids.has(note.id) ? { ...note, archived: true, updatedAt: Date.now() } : note
        );
      }
      if (selectionMode.action === 'unarchive') {
        return prev.map((note) =>
          ids.has(note.id) ? { ...note, archived: false, updatedAt: Date.now() } : note
        );
      }
      return prev;
    });
    setSelectionMode({ action: null, ids: [] });
  };

  useEffect(() => {
    setSelectionMode({ action: null, ids: [] });
  }, [view]);

  return (
    <div className="app">
      <NotesSidebar
        notes={visibleNotes}
        activeId={activeId}
        onSelect={setActiveId}
        onAddNote={addNote}
        onDeleteNote={deleteNote}
        view={view}
        onChangeView={setView}
        disableAdd={view === 'archive'}
        onStartSelection={startSelection}
        isSelecting={Boolean(selectionMode.action)}
        selectedIds={selectionMode.ids}
        selectionActionLabel={
          selectionMode.action ? actionLabels[selectionMode.action] : ''
        }
        selectionActionType={selectionMode.action}
        onToggleSelection={toggleSelection}
        onCancelSelection={cancelSelection}
        onApplySelection={applySelection}
      />
      <NoteEditor note={activeNote} onUpdate={updateNote} />
    </div>
  );
};

export default App;

