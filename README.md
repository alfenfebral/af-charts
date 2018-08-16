## AF Charts

## Patch 0.0.7
Remove x in data

### Usage

```js
import { LineChart } = require('af-charts');

render() {
  const data = {
    { d: 'Aug 13', p: '$6,252.37', y: 6252.37 },
    { d: 'Aug 14', p: '$6,192.31', y: 6192.3063 }
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

