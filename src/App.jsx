
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

  useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();
      // console.log('hootsData:', hootsData);
      // Set state:
      setHoots(hootsData);
    };
    if (user) fetchAllHoots();
  }, [user]);

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
          {user ? (
            // Protected Routes:
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/hoots" element={<HootList hoots={hoots} />} />
              <Route path="/hoots/:hootId" element={<HootDetails />} />
              {/* <Route
                path="/hoots/new"
                element={<h1>New Hoot</h1>}
              /> */}
              {/* <Route path="/hoots/new" element={<HootForm />} /> */}
              <Route path="/hoots/new" element={<HootForm handleAddHoot={handleAddHoot} />} />
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
