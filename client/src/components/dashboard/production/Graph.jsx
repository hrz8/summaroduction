import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

const optionsPercentage = {
  scales: {
    yAxes: [{
        ticks: {
            beginAtZero:true,
            min: 0,
            max: 100    
        }
      }]
   }
}

const optionsAmount = {
  scales: {
    yAxes: [{
        ticks: {
            beginAtZero:true,
            min: 0
        }
      }]
   }
}

class Graph extends Component {
  render() {
    let labels = [], 
    dataSetOEE = [], 
    dataSetOEE2 = [], 
    dataOK = [], 
    dataOK2 = [],
    datNG = [];
    let dataAmountOK = [];
    let dataAmountFY = [];
    let dataAmountNG =[];
    this.props.state.forEach(item => {
      labels.push(moment(item.startAt).format('dddd DD/MM/YYYY'));
      dataSetOEE.push(item.oee);
      dataSetOEE2.push(item.oee2);
      dataOK.push(item.qRate);
      dataOK2.push(item.qRate2);
      datNG.push(item.ngRate);
      dataAmountOK.push(item.okAmount);
      dataAmountFY.push(item.fy);
      dataAmountNG.push(item.ng);
    })
    const dataPercentage = {
      labels: labels.reverse(),
      datasets: [
        {
          label: 'OEE',
          lineTension: 0,
          fill: false,
          borderColor: '#00d6e8',
          data: dataSetOEE.reverse()
        },
        {
          label: 'OEE2',
          lineTension: 0,
          fill: false,
          borderColor: '#eb7000',
          data: dataSetOEE2.reverse()
        },
      ]
    };

    const dataQ = {
      labels: labels.reverse(),
      datasets: [
        {
          label: 'Quality Rate',
          lineTension: 0,
          fill: false,
          borderColor: '#002ede',
          data: dataOK.reverse()
        },
        {
          label: 'Quality Rate (+Reuse)',
          lineTension: 0,
          fill: false,
          borderColor: '#00a685',
          data: dataOK2.reverse()
        },
        {
          label: 'NG',
          lineTension: 0,
          fill: false,
          borderColor: '#eb1000',
          data: datNG.reverse()
        },
      ]
    };

    const dataAmount = {
      labels: labels.reverse(),
      datasets: [
        {
          label: 'OK',
          lineTension: 0,
          fill: false,
          borderColor: '#00d6e8',
          data: dataAmountOK.reverse()
        },
        {
          label: 'FY',
          lineTension: 0,
          fill: false,
          borderColor: '#eb7000',
          data: dataAmountFY.reverse()
        },
        {
          label: 'NG',
          lineTension: 0,
          fill: false,
          borderColor: '#9dbb00',
          data: dataAmountNG.reverse()
        }
      ]
    };
    
    return (
      <div>
        <Line width={700} height={300} data={dataPercentage} options={optionsPercentage} />
        <Line width={700} height={300} data={dataQ} options={optionsPercentage} />
        <Line width={700} height={300} data={dataAmount} options={optionsAmount} />
      </div>
    );
  }
}

export default Graph;
