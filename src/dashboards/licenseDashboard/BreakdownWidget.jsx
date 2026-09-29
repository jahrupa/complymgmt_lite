import React, { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { FormControl, MenuItem, Select } from "@mui/material";
import DashboardCard from "../common/DashboardCard";
import { fetchLicenseDashBreakdown } from "../../api/service";
import { formatPercent } from "../common/dashboardUtils";
import { BREAKDOWN_LABELS, VALIDITY, VALIDITY_ORDER } from "./licenseUtils";

/**
 * LC-3: licenses grouped by a dimension, stacked by validity. The dimension has its own request so
 * switching it doesn't refetch the rest of the dashboard. Clicking a bar applies that filter
 * (every breakdown dimension has a filter param of the same name).
 */
const BreakdownWidget = ({ selection, enabled, params, by, dimensions, onByChange, onDrill }) => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const requestIdRef = useRef(0);

    useEffect(() => {
        if (!enabled) return;
        const requestId = ++requestIdRef.current;
        setLoading(true);
        fetchLicenseDashBreakdown({ ...params, by })
            .then((res) => requestId === requestIdRef.current && setRows(res?.data || []))
            .catch(() => requestId === requestIdRef.current && setRows([]))
            .finally(() => requestId === requestIdRef.current && setLoading(false));
    }, [enabled, params, by]);

    const chart = {
        series: VALIDITY_ORDER.map((key) => ({ name: VALIDITY[key].label, data: rows.map((r) => r[key] || 0) })),
        options: {
            chart: {
                type: "bar",
                stacked: true,
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        const name = rows[dataPointIndex]?.name;
                        if (name) onDrill({ [by]: [name] });
                    },
                },
            },
            colors: VALIDITY_ORDER.map((key) => VALIDITY[key].color),
            states: { active: { filter: { type: "none" } } },
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: "60%",
                    dataLabels: { total: { enabled: true, style: { fontSize: "12px", fontWeight: 700 } } },
                },
            },
            dataLabels: { enabled: false },
            xaxis: { categories: rows.map((r) => r.name || "(blank)") },
            yaxis: { labels: { maxWidth: 240 } },
            tooltip: {
                shared: true,
                intersect: false,
                y: { formatter: (val) => (val ? val : undefined) },
                x: {
                    formatter: (val, { dataPointIndex }) => {
                        const r = rows[dataPointIndex];
                        return r ? `${val} · ${r.total} licenses · ${formatPercent(r.valid_percent)} valid · ${r.locations} locations` : val;
                    },
                },
            },
            legend: { position: "top", horizontalAlign: "left" },
        },
    };

    return (
        <DashboardCard
            selection={selection}
            title="Breakdown"
            subtitle="Largest first. Click a bar to filter to it"
            loading={loading}
            isEmpty={rows.length === 0}
            actions={
                <FormControl size="small" sx={{ minWidth: 170 }}>
                    <Select value={by} onChange={(e) => onByChange(e.target.value)}>
                        {(dimensions?.length ? dimensions : Object.keys(BREAKDOWN_LABELS)).map((d) => (
                            <MenuItem key={d} value={d}>
                                By {(BREAKDOWN_LABELS[d] || d).toLowerCase()}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            }
        >
            <Chart options={chart.options} series={chart.series} type="bar" height={Math.max(240, rows.length * 42 + 80)} />
        </DashboardCard>
    );
};

export default BreakdownWidget;
