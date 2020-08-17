# rollup-plugin-worker

a rollup plugin for worker


# options
- prefix: string; default is 'worker!'
- plugins: Plugin[]; Plugins needed in the process of processing worker
- uglify: boolean; default is false; enable uglify?

```javascript
const worker = require('rollup-plugin-worker');

module.exports = {
    plugins: [
        worker({
            prefix: 'worker!',
            plugins: [],
            uglify: false,
        }),
    ],
};
```