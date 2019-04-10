
## Envar

Get strings interpreted by bash (for env var interpolation, etc).

```js
const envar = require('@oresoftware/envstr');

envar.getEnvStrings(["$age"], (err, values) => {
    // err is potential error
    // values is array of interpreted strings
});

envar.getEnvString("$age", (err, value) => {
  // err is potential error
  // value is interpreted string
});


envar.getEnvStringsp(["$age"]).then(values => {
  // values is array of interpreted strings
});

envar.getEnvStringp("$age").then(val => {
  // val is interpreted string
});




```

To kill the process at anytime:

```js
envar.kill(9);
```

