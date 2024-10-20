import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import SignUp from "./pages/SignUp/SignUp"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";



function App() {
  return(
    <Router>
      <Routes>
        <Route path="/dashboard" exact element={<Home/>}/>
        <Route path="/login" exact element={<Login/>}/>
        <Route path="/" exact element={<SignUp/>}/>
      </Routes>
    </Router>
  )
}

export default App
