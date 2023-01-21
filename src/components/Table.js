import React from 'react';
import './Table.css' 

const DynamicTable = ({ data, message }) => {
  const headers = Object.keys(data[0].assignments);

  return (
    <table class="truth-table">
      <thead class="header">
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
          <th>{message.replaceAll('(', '').replaceAll(')', '')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {headers.map((header, index) => (
              <td key={index}>{item.assignments[header]}</td>
            ))}
            <td>{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;