import loaderUtils from 'loader-utils';
import { getPool } from './workerPools';

function loader(source, inputSourceMap) {
  const options = loaderUtils.getOptions(this) || {};
  const workerPool = getPool(options);
  if (!workerPool.isAbleToRun()) {
    return;
  }
  const callback = this.async();
  workerPool.run({
    loaders: [{
      loader: options.loaderWorker,
      options: options.loaderOption,
    }],
    resource: this.resourcePath + (this.resourceQuery || ''),
    resourceContent: source,
    sourceMap: inputSourceMap,
    emitError: this.emitError,
    emitWarning: this.emitWarning,
    resolve: this.resolve,
    target: this.target,
    minimize: this.minimize,
    resourceQuery: this.resourceQuery,
    optionsContext: this.rootContext || this.options.context,
  }, (err, r) => {
    if (r) {
      r.fileDependencies.forEach(d => this.addDependency(d));
      r.contextDependencies.forEach(d => this.addContextDependency(d));
    }
    if (err) {
      callback(err);
      return;
    }
    callback(null, ...r.result);
  });
}

function warmup(options, requires) {
  const workerPool = getPool(options);
  workerPool.warmup(requires);
}

export { loader as default, warmup }; // eslint-disable-line import/prefer-default-export
