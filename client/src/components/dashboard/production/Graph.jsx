import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import Card from '../../common/Card';

class Graph extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const data = {
      labels: ['January', 'February'],
      datasets: [
        {
          label: this.props.label,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 30]
        }
      ]
    };
    return (
      <div>
        <Card title="Graph" col={12}>
          <Line width={700} height={300} data={data} />
        </Card>
      </div>
    );
  }
}

export default Graph;