import React, { useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register module
ModuleRegistry.registerModules([AllCommunityModule]);

const ClientComplianceTable = ({ data ,gridRef}) => {
    // Convert compliance_info object into array
    const rowData = useMemo(() => {
        return Object.entries(data?.compliance_info || {}).map(([name, client]) => ({
            name,
            average_compliance_score: client?.average_compliance_score || 0,
        }));
    }, [data]);

    // Function to determine cell styles based on score
    const getCellStyle = (score) => {
        if (score > 300) {
            return {
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                border: '1px solid #10b981',
            };
        }
        if (score > 100 && score < 300) {
            return {
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                borderColor: '#3b82f6',
            };
        }
        if (score > 80 && score <= 100) {
            return {
                background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                borderColor: '#8b5cf6',
            };
        }
        if (score >= 50 && score <= 80) {
            return {
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                borderColor: '#f59e0b',
            };

        }
        if (score > 0 && score < 50) {
            return {
                background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                borderColor: '#f97316',
            };
        }
        if (score === 0) {
            return {
                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                borderColor: '#ef4444',
            };
        }
        // add other conditions as needed
        return {};
    };
    // Column definitions
    const columnDefs = [
        { headerName: "Client Name", field: "name", flex: 2 },
        {
            headerName: "Compliance Score",
            field: "average_compliance_score",
            flex: 1,
            cellStyle: (params) => getCellStyle(params.value), // ✅ dynamic styles
            cellRenderer: (params) => `${params.value}%`,
        },
    ];


    return (
        <div className="ag-theme-quartz" style={{ height: '600px', width: '100%', marginTop: '1rem' }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                theme="legacy"
                ref={gridRef}
            />
        </div>
    );
};

export default ClientComplianceTable;
