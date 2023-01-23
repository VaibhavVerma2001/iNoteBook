import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NoteContext from '../context/notes/NoteContext';



function Navbar() {
    let location = useLocation();
    const context = useContext(NoteContext);
    const { user } = context;
    // useEffect(() => {
    //     // console.log(location);
    //     console.log(location.pathname);
    //   },[location]);
    const navigate = useNavigate();

    const handleLogout = () => {
        // remove token
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        // redirect to login
        navigate("/login");

    }
    console.log("from localstorage the user is : ", localStorage.getItem('name'));
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">

                    <Link className="navbar-brand" to="/">iNotebook</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                            </li>

                        </ul>

                        {/* dont show login signin buttons when user is already logged in */}
                        {!localStorage.getItem('token') ? <form className="d-flex">
                            <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
                            <Link className="btn btn-primary mx-1" to="/signup" role="button">Signup</Link>
                        </form> :
                            <>
                                {localStorage.getItem('name') ? <span style={{ color: "white" }}>{localStorage.getItem('name')} </span> : <span style={{ color: "white" }}>No user</span>}
                                <button style={{ marginLeft: "10px" }} className="btn btn-primary" onClick={handleLogout}>Logout</button>
                            </>
                        }
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
