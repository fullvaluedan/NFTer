import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "@/components/Layout"
import Home from "@/pages/Home"
import Generate from "@/pages/Generate"

// Enable future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
}

function App() {
  return (
    <Router future={router.future}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<Generate />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
