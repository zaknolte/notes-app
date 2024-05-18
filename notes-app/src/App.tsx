import { useState } from 'react';
import './App.css';

type Note = {
  id: number;
  title: string;
  content: string;
}

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
  ])

  return(
    <div className='notes-container'>
      <form className='notes-form'>
        <input placeholder='Note Title' required></input>
        <textarea placeholder='Note Content' required rows={12}></textarea>
        <button type='submit'>Add Note</button>
      </form>
      <div className='notes-grid'>
        {notes.map((note) => (
          <div className='notes-item'>
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
