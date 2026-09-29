import React from "react";
import Chart from "react-apexcharts";
import ChallanCard from "./ChallanCard";
import { formatINR, formatINRShort, formatPercent } from "./challanUtils";

// CH-3: complied vs non-complied per act, with an act detail table
const ActWiseWidget = ({ selection, loading, actWise, onDrill }) => {
    const rows = actWise || [];

    const drillAct = (act) => act && onDrill({ act: [act] });

    const chart = {
        series: [
            { name: "Complied", data: rows.map((r) => r.complied) },
            { name: "Non-complied", data: rows.map((r) => r.non_complied) },
        ],
        options: {
            chart: {
                type: "bar",
                stacked: true,
                toolbar: { show: false },
                events: {
                    dataPointSelection: (event, ctx, { dataPointIndex }) => {
                        event?.stopPropagation?.();
                        drillAct(rows[dataPointIndex]?.act);
                    },
                },
            },
            colors: ["#14b8a6", "#f87171"],
            states: { active: { filter: { type: "none" } } },
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: "55%",
                    dataLabels: { total: { enabled: true, style: { fontSize: "13px", fontWeight: 900 } } },
                },
            },
            stroke: { width: 1, colors: ["#fff"] },
            xaxis: { categories: rows.map((r) => r.act) },
            tooltip: {
                y: {
                    formatter: (val, { dataPointIndex }) =>
                        `${val} (score ${formatPercent(rows[dataPointIndex]?.compliance_score)})`,
                },
            },
            legend: { position: "top", horizontalAlign: "left" },
        },
    };

    return (
        <ChallanCard
            selection={selection}
            title="Act-wise Compliance"
            subtitle="Click an act to see its records"
            loading={loading}
            isEmpty={rows.length === 0}
        >
            <Chart options={chart.options} series={chart.series} type="bar" height={Math.max(180, rows.length * 60 + 60)} />
            <div className="table-responsive" onClick={(e) => e.stopPropagation()}>
                <table className="table table-sm table-hover align-middle mb-0 small">
                    <thead>
                        <tr>
                            <th>Act</th>
                            <th className="text-end">Challans</th>
                            <th className="text-end">Compliance</th>
                            <th className="text-end">On time</th>
                            <th className="text-end">Amount</th>
                            <th className="text-end">Penalty</th>
                            <th className="text-end">Headcount</th>
                            <th className="text-end">New joinees</th>
                            <th className="text-end">UAN / TIC</th>
                            <th className="text-end">Locations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.act} style={{ cursor: "pointer" }} onClick={() => drillAct(r.act)}>
                                <td className="fw-600">{r.act}</td>
                                <td className="text-end">{r.total}</td>
                                <td className="text-end">{formatPercent(r.compliance_score)}</td>
                                <td className="text-end">{formatPercent(r.on_time_percent)}</td>
                                <td className="text-end" title={formatINR(r.amount)}>{formatINRShort(r.amount)}</td>
                                <td className="text-end">{formatINR(r.estimated_penalty)}</td>
                                <td className="text-end">
                                    {r.headcount ?? "–"}
                                    {r.headcount_month && <div className="text-muted" style={{ fontSize: 11 }}>{r.headcount_month}</div>}
                                </td>
                                <td className="text-end">{r.new_joinees ?? "–"}</td>
                                {/* UAN applies to PF, TIC to ESIC */}
                                <td className="text-end">
                                    {r.act === "PF" ? `UAN ${r.uan_generated ?? 0}` : r.act === "ESIC" ? `TIC ${r.tic_generated ?? 0}` : "–"}
                                </td>
                                <td className="text-end">{r.locations ?? "–"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ChallanCard>
    );
};

export default ActWiseWidget;
