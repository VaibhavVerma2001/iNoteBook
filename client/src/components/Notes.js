import React, { useContext, useEffect , useRef , useState} from 'react';
import NoteContext from '../context/notes/NoteContext';
import Noteitem from './Noteitem';
import { useNavigate } from 'react-router-dom';

function Notes(props) {

    const navigate = useNavigate();

    const context = useContext(NoteContext);
    const { notes, getNotes ,editNote } = context;

    // getch notes once 
    useEffect(() => {
        // if localstorage token in null then redirect to login page else continue
        if(localStorage.getItem('token')){
            getNotes();
        }
        else{
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [])


    // for edit functionality
    // with useRef hook we can give reference to any element
    const ref = useRef(null); // to open modal
    const refClose = useRef(null); // to close modal

    const [note, setNote] = useState({id : "" ,etitle: "", edescription: "", etag: ""})

    const updateNote = (currentNote) => {
        ref.current.click(); // to opem modal // means perform in current ref click
        setNote({id : currentNote._id ,etitle: currentNote.title, edescription: currentNote.description, etag:currentNote.tag});
    }

    
    const handleClick = (e)=>{
        // console.log("Updating the note...", note);
        editNote(note.id, note.etitle, note.edescription, note.etag);
        props.showAlert("Updated Successfully","success");
        refClose.current.click(); // to close modal
    }


    // handle change
    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value});
    }


    return (
        <>
            {/* Bootstrap modal for updating note */}
            {/* giving ref to button so that it opens on click */}
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                {/* d-none means display none to hide this button */}
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* addnote type form */}
                            <form className="my-3">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                                </div>
 
                            </form>
                        </div>
                        <div className="modal-footer">
                            {/* refClose */}
                            <button type="button" ref = {refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {/* since we made desc and title required so disable submit button if there length is 0 */}
                            <button disabled = {note.etitle.length===0 || note.edescription.length===0} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Display notes */}
            <div className="row">
                <h2 className='mt-4'>Your notes</h2>
                <div className="container">
                    {notes.length===0 && 'No notes to display'}
                </div>
                {notes.map((note) => {
                    return (
                        <div key={note._id} className="col-md-3">
                            <Noteitem note={note}  updateNote={updateNote} />
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Notes;
