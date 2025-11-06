import { MapPin, Grid, BarChart } from 'lucide-react';
import '../../../style/clientOnBoardingByCompany.css';

function StatsPanel({ totalLocations, filteredLocations, totalModules }) {
    return (
        <div className="">
            <div className="stats-grid">
                <div className="stat-card performer-card high-performer">
                    <div className="stat-icon">
                        <MapPin size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{totalLocations}</div>
                        <div className="stat-label">Total Locations</div>
                    </div>
                </div>
                <div className="stat-card performer-card compliant">
                    <div className="stat-icon">
                        <BarChart size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{filteredLocations}</div>
                        <div className="stat-label">Filtered Results</div>
                    </div>
                </div>
                <div className="stat-card performer-card moderate">
                    <div className="stat-icon">
                        <Grid size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{totalModules}</div>
                        <div className="stat-label">Total Modules</div>
                    </div>
                </div>
            </div>
            {/* <h3>Statistics</h3> */}
            {/* <div className="client-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <MapPin size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{totalLocations}</div>
                        <div className="stat-label">Total Locations</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <BarChart size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{filteredLocations}</div>
                        <div className="stat-label">Filtered Results</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <Grid size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{totalModules}</div>
                        <div className="stat-label">Total Modules</div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default StatsPanel;
