const NoteEditor = ({ note, onUpdate }) => {
  if (!note) {
    return (
      <div className="editor empty">
        <p>Select or create a note to begin.</p>
      </div>
    );
  }

  const handleChange = (field) => (event) => {
    onUpdate(field, event.target.value);
  };

  return (
    <section className="editor">
      <input
        className="editor-title"
        type="text"
        value={note.title}
        onChange={handleChange('title')}
        placeholder="Untitled note"
        aria-label="Note title"
      />
      <textarea
        className="editor-body"
        value={note.content}
        onChange={handleChange('content')}
        placeholder="Start writing…"
        aria-label="Note body"
      />
    </section>
  );
};

export default NoteEditor;

