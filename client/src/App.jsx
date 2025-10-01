import Router from "./routes/Router"
import Navbar from "./components/Navbar"
import { getData } from "./services/api"



function App() {
  
  getData()
  return (
    <>
      
      <Router />
      
    </>
  )
}

export default App
