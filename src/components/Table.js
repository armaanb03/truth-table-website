import React from 'react';
import './Table.css' 

const DynamicTable = ({ data, message }) => {
  const headers = Object.keys(data[0].assignments);

  const handleOnMouseMove = e => {
    const { currentTarget: target } = e;

    const rect = target.getBoundingClientRect(),
      x= e.clientX - rect.left,
      y= e.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`)
    target.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <div class="table-wrapper" onMouseMove={handleOnMouseMove}>
      <div class="table-border"></div>
      <div class="table-content">
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
      </div>
    </div>
  );
};

export default DynamicTable;