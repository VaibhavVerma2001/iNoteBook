import React, { useContext , useState} from 'react';
import NoteContext from '../context/notes/NoteContext';

function AddNote(props) {
    const context = useContext(NoteContext);
    const {addNote } = context;

    const [newnote,setNewNote] = useState({
        title :  "",
        description : "",
        tag : ""
    });

    const handleClick = (e)=>{
        e.preventDefault(); //so that page dont reload
        addNote(newnote.title,newnote.description,newnote.tag);
        // after adding make form values empty
        setNewNote({title :  "", description : "", tag : ""});
        props.showAlert("Added Successfully","success");
    }
    

    const handleChange = (e)=>{
        setNewNote({...newnote , [e.target.name]: e.target.value }); //means given name changes to its value and ...note means leave it as it is and append other changes
    }

    return (
        <>
            <div className='container mt-5'>
                <h1> Add a note </h1>
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" value={newnote.title}  name= "title" aria-describedby="emailHelp" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" value={newnote.description} name="description" onChange={handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag" value={newnote.tag} name="tag" onChange={handleChange}/>
                    </div>
                    {/* since we made desc and title required so disable submit button if there length is 0 */}
                    <button disabled = {newnote.title.length===0 || newnote.description.length===0} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
                </form>
            </div>
        </>
    )
}

export default AddNote;
