import React from 'react';
import { useParams } from 'react-router-dom';

const DetailsPage = () => {
  const { seriesName, year } = useParams();

  return (
    <div>
      <h2>Details for {seriesName}</h2>
      <p>Year: {year}</p>
      {/* You can fetch more data based on seriesName and year here */}
    </div>
  );
};

export default DetailsPage;
