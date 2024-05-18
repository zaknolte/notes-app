import { useState } from 'react';
import './App.css';

type Note = {
  id: number;
  title: string;
  content: string;
};

const App = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "test note 1",
      content: "text text 1"
    },
    {
      id: 2,
      title: "test note 2",
      content: "text text 2"
    },
    {
      id: 3,
      title: "test note 3",
      content: "text text 3"
    },
    {
      id: 4,
      title: "test note 4",
      content: "text text 4"
    }
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleCreateNote = (event: React.FormEvent) => {
    event.preventDefault();

    let addedNote: Note = {
      id: notes.length + 1,
      title: title,
      content: content
    };

    setNotes([...notes, addedNote]);
    setTitle("");
    setContent("");
  };

  const handleSelectNote = (note:Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateNote = (event: React.FormEvent) => {
    event.preventDefault();

    if(!selectedNote){
      return;
    }

    let updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content
    }

    let updatedNotesArray = notes.map((note) => note.id === selectedNote.id ? updatedNote : note)

    setNotes(updatedNotesArray);
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  return(
    <div className='notes-container'>
      <form className='notes-form' onSubmit={(e) => selectedNote ? handleUpdateNote(e) : handleCreateNote(e)}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Note Title'
          required
        ></input>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Note Content'
          required rows={12}
        ></textarea>
        {
          selectedNote ? (
            <div className='notes-edit-btn'>
              <button type='submit'>Save</button>
              <button className='notes-btn-cancel' onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            <button type='submit'>Add Note</button>
          )
        }
      </form>
      <div className='notes-grid'>
        {notes.map((note) => (
          <div className='notes-item' onClick={() => handleSelectNote(note)}>
            <div className='notes-header'>
              <button>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App;
