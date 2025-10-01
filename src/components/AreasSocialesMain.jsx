import React, { useState } from 'react';
import AreasSociales from './AreasSociales';
import ReservasAreaSocial from './ReservasAreaSocial';

const AreasSocialesMain = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [currentView, setCurrentView] = useState('areas'); // 'areas' o 'reservas'

  const handleAreaClick = (area) => {
    setSelectedArea(area);
    setCurrentView('reservas');
  };

  const handleVolver = () => {
    setSelectedArea(null);
    setCurrentView('areas');
  };

  return (
    <div>
      {currentView === 'areas' && (
        <AreasSociales onSelectArea={handleAreaClick} />
      )}
      
      {currentView === 'reservas' && selectedArea && (
        <ReservasAreaSocial 
          area={selectedArea} 
          onBack={handleVolver}
        />
      )}
    </div>
  );
};

export default AreasSocialesMain;