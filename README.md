## AF Charts

###Usage

```js
import { LineChart } = require('af-charts');

render() {
  const data = {
    { d: 'Aug 13', p: '$6,252.37', x: 29, y: 6252.37 },
    { d: 'Aug 14', p: '$6,192.31', x: 30, y: 6192.3063 }
  };

  return (
    <LineChart data={data} />
  );
}
```

## Props

| Name | Type |
| --- | --- |
| data | object |
| areaStyle | object | 

