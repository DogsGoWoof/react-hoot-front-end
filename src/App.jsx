
import { useState, createContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

//___Components___//
import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import SignupForm from './components/SignupForm/SignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import HootList from './components/HootList/HootList';
import HootDetails from './components/HootDetails/HootDetails';
import HootForm from './components/HootForm/HootForm';
import CommentForm from './components/CommentForm/CommentForm';

//___Services___//
import * as authService from '../src/services/authService'; // import the authservice
import * as hootService from './services/hootService';

//___Context___//
export const AuthedUserContext = createContext(null);

const App = () => {

  //___States___//
  const [user, setUser] = useState(authService.getUser()); // using the method from authservice
  const [hoots, setHoots] = useState([]);

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();
      // console.log('hootsData:', hootsData);
      // Set state:
      setHoots(hootsData);
    };
    if (user) fetchAllHoots();
  }, [user]);

  // const handleAddHoot = async (hootFormData) => {
  //   console.log('hootFormData', hootFormData);
  //   navigate('/hoots');
  // };
  const handleAddHoot = async (hootFormData) => {
    const newHoot = await hootService.create(hootFormData);
    setHoots([newHoot, ...hoots]);
    // add new value to front of the array to display newest entry at the top
    navigate('/hoots');
  };

  // const handleDeleteHoot = async (hootId) => {
  //   console.log('hootId', hootId);
  // };
  // const handleDeleteHoot = async (hootId) => {
  //   console.log('hootId', hootId);
  //   setHoots(hoots.filter((hoot) => hoot._id !== hootId));
  //   navigate('/hoots');
  // };
  const handleDeleteHoot = async (hootId) => {
    // Call upon the service function:
    const deletedHoot = await hootService.deleteHoot(hootId);
    // Filter state using deletedHoot._id:
    setHoots(hoots.filter((hoot) => hoot._id !== deletedHoot._id));
    // Redirect the user:
    navigate('/hoots');
  };

  // const handleUpdateHoot = async (hootId, hootFormData) => {
  //   console.log('hootId:', hootId, 'hootFormData:', hootFormData);
  //   navigate(`/hoots/${hootId}`);
  // };
  const handleUpdateHoot = async (hootId, hootFormData) => {

    const updatedHoot = await hootService.update(hootId, hootFormData);

    setHoots(hoots.map((hoot) => (hootId === hoot._id ? updatedHoot : hoot)));

    navigate(`/hoots/${hootId}`);

  };

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
          {user ? (
            // Protected Routes:
            <>
              <Route path="/" element={<Landing />} />
              {/* <Route path="/" element={<Dashboard user={user} />} /> */}
              <Route path="/hoots" element={<HootList hoots={hoots} />} />
              {/* <Route path="/hoots/:hootId" element={<HootDetails />} /> */}
              <Route path="/hoots/new" element={<HootForm handleAddHoot={handleAddHoot} />} />
              <Route
                path="/hoots/:hootId"
                element={<HootDetails handleDeleteHoot={handleDeleteHoot} />}
              />
              {/* <Route path="/hoots/:hootId/edit" element={<HootForm />} /> */}
              <Route
                path="/hoots/:hootId/edit"
                element={<HootForm handleUpdateHoot={handleUpdateHoot} />}
              />
              {/* <Route
                path="/hoots/new"
                element={<h1>New Hoot</h1>}
              /> */}
              {/* <Route path="/hoots/new" element={<HootForm />} /> */}
              <Route
                path="/hoots/:hootId/comments/:commentId/edit"
                element={<CommentForm />}
              />
            </>
          ) : (
            // Public Route:
            <Route path="/" element={<Landing />} />
          )}
          <Route path="/signup" element={<SignupForm setUser={setUser} />} />
          <Route path="/signin" element={<SigninForm setUser={setUser} />} />
        </Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
