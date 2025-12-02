import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PageRoute from './route/PageRoute';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
// console.log("ENV URL:", import.meta.env.VITE_API_BASE_URL);
  return (
    <Router>
      <PageRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </Router>
  );
}

export default App;
