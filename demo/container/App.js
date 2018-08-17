import React, { Component } from 'react';
import { LineChart } from 'af-charts';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Line Chart Example',
      data: [
        { d: 'Jul 15', p: '$6,349.04', y: 6349.0375 },
        { d: 'Jul 16', p: '$6,726.41', y: 6726.405 },
        { d: 'Jul 17', p: '$7,314.94', y: 7314.9425 },
        { d: 'Jul 18', p: '$7,378.76', y: 7378.7575 },
        { d: 'Jul 19', p: '$7,470.83', y: 7470.825 },
        { d: 'Jul 20', p: '$7,330.54', y: 7330.5363 },
        { d: 'Jul 21', p: '$7,404.29', y: 7404.2875 },
        { d: 'Jul 22', p: '$7,396.29 - $7,396.29', y: 7396.2863 },
        { d: 'Jul 23', p: '$7,717.50 - $7,396.2', y: 7717.5 },
        { d: 'Jul 24', p: '$8,397.64', y: 8397.635 },
        { d: 'Jul 25', p: '$8,166.76', y: 8166.76 },
        { d: 'Jul 26', p: '$7,929.61', y: 7929.61 },
        { d: 'Jul 27', p: '$8,183.03', y: 8183.025 },
        { d: 'Jul 28', p: '$8,229.96', y: 8229.96 },
        { d: 'Jul 29', p: '$8,215.56', y: 8215.56 },
        { d: 'Jul 30', p: '$8,168.00', y: 8167.9988 },
        { d: 'Jul 31', p: '$7,726.89', y: 7726.8913 },
        { d: 'Aug 01', p: '$7,603.75', y: 7603.7488 },
        { d: 'Aug 02', p: '$7,535.02', y: 7535.02 },
        { d: 'Aug 03', p: '$7,415.56', y: 7415.5613 },
        { d: 'Aug 04', p: '$7,009.09', y: 7009.0888 },
        { d: 'Aug 05', p: '$7,026.99', y: 7026.9913 },
        { d: 'Aug 06', p: '$6,937.07', y: 6937.0738 },
        { d: 'Aug 07', p: '$6,717.21', y: 6717.2088 },
        { d: 'Aug 08', p: '$6,280.58', y: 6280.58 },
        { d: 'Aug 09', p: '$6,537.90', y: 6537.9025 },
        { d: 'Aug 10', p: '$6,143.31', y: 6143.305 },
        { d: 'Aug 11', p: '$6,233.38', y: 6233.3813 },
        { d: 'Aug 12', p: '$6,312.83', y: 6312.8338 },
        { d: 'Aug 13', p: '$6,252.37', y: 6252.37 },
        { d: 'Aug 14', p: '$6,192.31', y: 6192.3063 },
      ]
    };
  }

  render() {
    const { title, data } = this.state;
    return (
      <div>
        {title}
        <LineChart data={data} />
      </div>
    );
  }
}

export default App;
