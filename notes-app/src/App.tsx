import { useEffect, useState } from 'react';
import './App.css';

type Note = {
  id: number;
  title: string;
  content: string;
};

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notes");
        const notes: Note[] = await res.json();

        setNotes(notes);
      } catch (error) {
        console.log(error);
      }
    };

    getNotes();
  }, [])

  // ADD NEW NOTE
  const handleCreateNote = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/notes", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            {
              title,
              content
            }
          )
        }
      );

      const addedNote = await res.json();
      setNotes([...notes, addedNote]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.log(error)
    }
  };

  // SELECT A NOTE TO EDIT
  const handleSelectNote = (note:Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  // SAVE EDITS TO NOTE
  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();

    if(!selectedNote){
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            content
          })
        }
      );
      const updatedNote = await res.json();
      const updatedNotesArray = notes.map((note) => note.id === selectedNote.id ? updatedNote : note);

      setNotes(updatedNotesArray);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (error) {
      console.log(error);
    }
  };

  // CANCEL NOTE EDIT
  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  // DELETE NOTE
  const handleDeleteNote = async (event: React.MouseEvent, noteId: number) => {
    // Delete 'x' is inside of note - make sure to stop the calling of handleUpdateNote
    event.stopPropagation();

    try {
      await fetch(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );
      const remainingNotes = notes.filter((note) => note.id !== noteId)
  
      setNotes(remainingNotes);
  
      // Reset properties if you are deleting note that is currently selected
      if(selectedNote && noteId === selectedNote.id){
        setTitle("");
        setContent("");
        setSelectedNote(null);
      };
    } catch (error) {
      console.log(error)
    }
  };

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
              <button onClick={(e) => handleDeleteNote(e, note.id)}>x</button>
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
