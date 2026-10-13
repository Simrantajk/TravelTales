// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // import TravellerViewPlace from "./TravellerComponents/TravellerViewPlace";
// // import TravellerNavbar from "./TravellerComponents/TravellerNavbar";


// function App() {
//   return (
//     <Router>
//      <TravellerNavbar/>
//       <Routes>
    
    
//         <Route path="/places" element={<TravellerViewPlace />} />
        
// // //       </Routes>
// // //     </Router>
// // //   );
// // // }

// // export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './Components/Login';
// import Signup from './Components/Signup';
// import HomePage from './Components/HomePage';
// import ErrorPage from './Components/ErrorPage';
// import PrivateRoute from './Components/PrivateRoute';
// import GuideNavbar from './GuideComponents/GuideNavbar';
// import TravellerNavbar from './TravellerComponents/TravellerNavbar';
// import './App.css';
// import PlaceForm from './GuideComponents/PlaceForm';
// import ViewPlace from './GuideComponents/ViewPlace';
// import TravellerViewPlace from './TravellerComponents/TravellerViewPlace';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Landing Page */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* Common HomePage */}
//         <Route
//           path="/"
//           element={
//             <PrivateRoute>
//               <HomePage />
//             </PrivateRoute>
//           }
//         />

//         {/* Role-based routes */}
//         <Route
//           path="/guide"
//           element={
//             <PrivateRoute allowedRoles={['Guide']}>
//               <GuideNavbar />
//               <Routes>
//             <Route path="/add-place" element ={<PlaceForm/>}/>
//             <Route path="/view-place" element ={<ViewPlace/>}/>
//             </Routes>
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/traveller"
//           element={
//             <PrivateRoute allowedRoles={['Traveller']}>
//               <TravellerNavbar />
//               <Routes>
//              <Route path="/places" element={<TravellerViewPlace/>}/>
//              </Routes>
//             </PrivateRoute>
//           }
//         />

//         {/* Unauthorized and Error */}
//         <Route path="/unauthorized" element={<ErrorPage />} />
//         <Route path="*" element={<ErrorPage />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import HomePage from './Components/HomePage';
import ErrorPage from './Components/ErrorPage';
import PrivateRoute from './Components/PrivateRoute';
import './App.css';
import PlaceForm from './GuideComponents/PlaceForm';
import ViewPlace from './GuideComponents/ViewPlace';
import TravellerViewPlace from './TravellerComponents/TravellerViewPlace';
 
const App = () => {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<Login/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
 
       
        <Route
  path="/guide"
  element={
    <PrivateRoute allowedRoles={['Guide']}>
      <HomePage />
    </PrivateRoute>
  }
/>

<Route
  path="/traveller"
  element={
    <PrivateRoute allowedRoles={['Traveller']}>
      <HomePage />
    </PrivateRoute>
  }
/>
 
        <Route
          path="/guide/add-place"
          element={
            <PrivateRoute allowedRoles={['Guide']}>
              <PlaceForm/>
             
            </PrivateRoute>
          }
        />
         <Route
          path="/guide/view-place"
          element={
            <PrivateRoute allowedRoles={['Guide']}>
              <ViewPlace/>
             
            </PrivateRoute>
          }
        />
        <Route
          path="/traveller/view-place"
          element={
            <PrivateRoute allowedRoles={['Traveller']}>
              <TravellerViewPlace />
           
            </PrivateRoute>
          }
        />
 
        {/* Unauthorized and Error */}
        <Route path="/unauthorized" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};
 
export default App;
 