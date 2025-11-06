import { Filter } from 'lucide-react';
import '../../../style/clientOnBoardingByCompany.css';

function ModuleFilter({ selectedModule, onModuleChange, modules }) {
  return (
    <div className="module-filter">
      <div className="filter-header">
        <Filter size={18} />
        <h3>Filter by Module</h3>
      </div>
      <div className="filter-options">
        <button
          className={`filter-option ${selectedModule === 'all' ? 'active' : ''}`}
          onClick={() => onModuleChange('all')}
        >
          All Modules
        </button>
        {modules.map((module) => (
          <button
            key={module}
            className={`filter-option ${selectedModule === module.toLowerCase() ? 'active' : ''}`}
            onClick={() => onModuleChange(module.toLowerCase())}
          >
            {module}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ModuleFilter;
