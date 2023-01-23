import Notes from './Notes';
import AddNote from './AddNote';

function Home(props) {

  return (
    <div className='container mt-5'>
      <AddNote showAlert={props.showAlert} />

      <Notes showAlert={props.showAlert} />
    </div>
  )
}

export default Home;
