import Chart from 'react-apexcharts';
import '../../style/clientOnbordingDashboard.css';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import DashboardDrawerGrid from '../DashboardDrawer';

const ClientOnbordingDashboard = ({ data }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnchor, setDrawerAnchor] = useState("right");
  const [drawerTitle, setDrawerTitle] = useState("");
  const [chartXaxisCategory, setChartXaxisCategory] = useState("");
  const [isDetailPage, setIsDetailPage] = useState(false);
  const [isDetailPageData, setIsDetailPageData] = useState([]);
  const [filterColumns, setFilterColumns] = useState([]);
  if (!data || Object.keys(data).length === 0) {
    return <div className='no-data'>{data === 403 ? 'No Data Found' : 'Loading...'}</div>;
  }

  // Process data for charts
  const getTopIndustries = () => {
    const industries = Object.entries(data.client_by_industry)
      .filter(([key]) => key !== "")
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    return {
      categories: industries.map(([name]) => name.length > 20 ? name.substring(0, 20) + '...' : name),
      series: industries.map(([, value]) => value)
    };
  };

  const getClientSizeData = () => {
    const sizes = Object.entries(data.size_wise_client)
      .filter(([key]) => key !== "" && key !== "_");
    return {
      labels: sizes.map(([name]) => name.charAt(0).toUpperCase() + name.slice(1)),
      series: sizes.map(([, value]) => value)
    };
  };

  const getTopServices = () => {
    const services = Object.entries(data.service_scope_matrix_portfolio)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15);

    return {
      categories: services.map(([name]) => name.length > 15 ? name.substring(0, 15) + '...' : name),
      series: services.map(([, value]) => value)
    };
  };

  const industryData = getTopIndustries();
  const clientSizeData = getClientSizeData();
  const servicesData = getTopServices();

  // Chart configurations
  const industryChartOptions = {
    chart: {
      type: 'bar',
      height: 400,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: { position: 'top' }
      }
    },
    colors: ['#3B82F6'],
    dataLabels: {
      enabled: true,
      offsetX: 30,
      style: { fontSize: '12px', colors: ['#304758'] }
    },
    xaxis: {
      categories: industryData.categories,
      title: { text: 'Number of Clients' }
    },
    yaxis: {
      title: { text: 'Industries' }
    },
    title: {
      text: 'Top 10 Industries by Client Count',
      align: 'center',
      style: { fontSize: '18px', fontWeight: 'bold' }
    }
  };

  const sizeChartOptions = {
    chart: {
      type: 'donut',
      height: 400
    },
    colors: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    labels: clientSizeData.labels,
    title: {
      text: 'Client Distribution by Size',
      align: 'center',
      style: { fontSize: '18px', fontWeight: 'bold' }
    },
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + '%';
      }
    }
  };

  const servicesChartOptions = {
    chart: {
      type: 'bar',
      height: 500,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: { position: 'top' }
      }
    },
    colors: ['#3B82F6'],
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: { fontSize: '12px', colors: ['#304758'] }
    },
    xaxis: {
      categories: servicesData.categories,
      title: { text: 'Services' },
      labels: {
        rotate: -45,
        style: { fontSize: '10px' }
      }
    },
    yaxis: {
      title: { text: 'Count' }
    },
    title: {
      text: 'Top 15 Services in Portfolio',
      align: 'center',
      style: { fontSize: '18px', fontWeight: 'bold' }
    }
  };

  const totalClients = Object.values(data.client_by_industry).reduce((sum, val) => sum + val, 0);
  const totalServices = Object.keys(data.service_scope_matrix_portfolio).length;
  const totalIndustries = Object.keys(data.client_by_industry).filter(key => key !== "").length;

  const handleOpenDrawer = (anchor, title, chartXaxisCategory, isDetailData, filterColumn) => {
    setDrawerAnchor(anchor);
    setDrawerTitle(title);
    setDrawerOpen(true);
    setChartXaxisCategory(chartXaxisCategory);
    setIsDetailPageData(isDetailData);
    setFilterColumns(filterColumn);
  };
  return (
    <div className="">
      <div className="client-onboarding-content">
        <div className="stats-grid">
          <div className="stat-card performer-card high-performer">
            <div className="stat-number">{totalClients}</div>
            <div className="stat-label">Total Clients</div>
          </div>
          <div className="stat-card performer-card compliant">
            <div className="stat-number">{totalIndustries}</div>
            <div className="stat-label">Industries Served</div>
          </div>
          <div className="stat-card performer-card moderate">
            <div className="stat-number">{totalServices}</div>
            <div className="stat-label">Service Types</div>
          </div>
          <div className="stat-card performer-card good">
            <div className="stat-number">{clientSizeData.series.reduce((sum, val) => sum + val, 0)}</div>
            <div className="stat-label">Categorized Clients</div>
          </div>
        </div>
        <div className="align-content-center d-flex justify-content-end mb-3">
          <button className="btn btn-primary " onClick={(e) => {
            e.stopPropagation();
            handleOpenDrawer(
              "left",
            )
          }}>
            View Details
          </button>
        </div>
        <div className="charts-grid mb-4">
          <div className="chart-card">

            <Chart
              options={sizeChartOptions}
              series={clientSizeData.series}
              type="donut"
              height={400}
            />

          </div>
          <div className="chart-card">

            <Chart
              options={industryChartOptions}
              series={[{ data: industryData.series }]}
              type="bar"
              height={400}
            />
          </div>
        </div>
      </div>
      <div className="client-onboarding-content">
        <div className="chart-card">

          <Chart
            options={servicesChartOptions}
            series={[{ data: servicesData.series }]}
            type="bar"
            height={600}
          />
        </div>
      </div>
      {/* )} */}
      <DashboardDrawerGrid
        anchor={drawerAnchor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={data?.company_details} //direct array
        title={drawerTitle}
        chartXaxisCategory={chartXaxisCategory}
        isDetailPage={isDetailPage}
        setIsDetailPage={setIsDetailPage}
        isDetailPageData={isDetailPageData}
        filterColumns={filterColumns}
        isCockpitComplianceDetailPage={true}

      />
    </div>
  );
};

export default ClientOnbordingDashboard;