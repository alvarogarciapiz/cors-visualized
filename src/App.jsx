import React from 'react';
import Header from './components/Header';
import SimulationPanel from './components/SimulationPanel';
import EducationalSection from './components/EducationalSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen relative">
      <div className="grid-bg"></div>
      <Header />
      <main>
        <SimulationPanel />
        <EducationalSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
