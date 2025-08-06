import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';

const StackedBar = () => {
  const navigate = useNavigate();

  const [state] = React.useState({
    series: [
      { name: 'Marine Sprite', data: [44, 55, 41, 37, 22, 43, 21] },
      { name: 'Striking Calf', data: [53, 32, 33, 52, 13, 43, 32] },
      { name: 'Tank Picture', data: [12, 17, 11, 9, 15, 11, 20] },
      { name: 'Bucket Slope', data: [9, 7, 5, 8, 6, 9, 4] },
      { name: 'Reborn Kid', data: [25, 12, 19, 32, 25, 24, 10] },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const seriesIndex = config.seriesIndex;
            const dataPointIndex = config.dataPointIndex;

            const seriesName = state.series[seriesIndex].name;
            const year = state.options.xaxis.categories[dataPointIndex];

            // Example: navigate to /details/Marine Sprite/2008
            navigate(`/details/${encodeURIComponent(seriesName)}/${year}`);
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: '13px',
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      title: {
        text: 'Documents',
      },
      xaxis: {
        categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
        labels: {
          formatter: (val) => val + 'K',
        },
      },
      tooltip: {
        y: {
          formatter: (val) => val + 'K',
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
    },
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default StackedBar;
