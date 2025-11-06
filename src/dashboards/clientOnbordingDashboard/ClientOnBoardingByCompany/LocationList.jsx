import { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import '../../../style/clientOnBoardingByCompany.css';

function LocationCard({ location, modules, selectedModule }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="location-card">
      <div className="location-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="location-info">
          <MapPin size={20} className="location-icon" />
          <h3 className="location-name">{location}</h3>
          <span className="module-count">{modules.length} modules</span>
        </div>
        <button className="expand-button">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {isExpanded && (
        <div className="location-body">
          <div className="modules-grid">
            {modules.map((module) => (
              <span
                key={module}
                className={`module-tag ${selectedModule !== 'all' && selectedModule === module ? 'highlighted' : ''}`}
              >
                {module}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LocationList({ locations, locationModuleMap, selectedModule }) {
  if (locations.length === 0) {
    return (
      <div className="no-results">
        <MapPin size={48} />
        <h3>No locations found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="location-list">
      <div className="list-header">
        <h2>Locations ({locations.length})</h2>
      </div>
      <div className="locations-container">
        {locations.map((location) => (
          <LocationCard
            key={location}
            location={location}
            modules={locationModuleMap[location]}
            selectedModule={selectedModule}
          />
        ))}
      </div>
    </div>
  );
}

export default LocationList;
