#### wrap a single loader into thread-loader

```js
{ 
  loader: require.resolve('thread-loader'),
  options: { 
    workers: 4, 
    loaderWorker: require.resolve('babel-loader'),
    loaderOption:
    { 
      compact: false,
      babelrc: false,
      presets: [Array],
      plugins: [Array] 
    },
  } 
}
```