/**
 * @NAPIVersion 2.1
 * @NScriptType MapReduceScript
 */
define(["require", "exports", "N/log", "N/search"], function (require, exports, log, search) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.summarize = exports.reduce = exports.map = exports.getInputData = void 0;
    /**
     * GetInputData
     */
    class GetInputData {
        /**
         * Returns an object containing search data.
         * @return {object} The search data object.
         */
        run() {
            const searchResult = search.load({ id: "customsearch_example" });
            return searchResult;
        }
    }
    /**
     * Map
     * @param {MapContext} context - The context to be used by the map.
     */
    class Map {
        context;
        /**
         * Create Map.
         * @param {MapContext} context - The context to be used by the map.
         */
        constructor(context) {
            this.context = context;
        }
        /**
         * Processes the data and writes it to the context.
         */
        run() {
            const values = JSON.parse(this.context.value);
            // Example.
            const k = values.key;
            const v = values.value;
            this.context.write(k, v);
        }
    }
    /**
     * Reduce
     * @param {ReduceContext} context - The context to be used by the reduce operation.
     */
    class Reduce {
        context;
        /**
         * Create Reduce.
         * @param {ReduceContext} context - The context to be used by the reduce operation.
         */
        constructor(context) {
            this.context = context;
        }
        /**
         * Processes the data and writes it to the context.
         */
        run() {
            const key = +this.context.key;
            const value = this.context.values[0];
            this.doSomething(key, value);
        }
        /**
         * Example function that logs a debug message and returns the value.
         * @param {number} key - The key associated with the value.
         * @param {*} value - The value to be processed.
         * @return {*} The processed value.
         */
        doSomething(key, value) {
            log.debug('doSomething', key);
            return value;
        }
    }
    /**
     * Summarize
     * @param {SummarizeContext} summary - The context to be used for summarizing the data.
     */
    class Summarize {
        summary;
        /**
         * Create Summarize.
         * @param {SummarizeContext} summary - The context to be used for summarizing the data.
         */
        constructor(summary) {
            this.summary = summary;
        }
        /**
         * Processes the data and writes a summary to the log.
         */
        run() {
            let contents = "";
            const type = this.summary.toString();
            log.debug(type + " Usage Consumed", this.summary.usage);
            log.debug(type + " Number of Queues", this.summary.concurrency);
            log.debug(type + " Number of Yields", this.summary.yields);
            this.summary.output.iterator().each(function (key, value) {
                contents += key + " " + value + "\n";
                return true;
            });
            log.debug("Contents", contents);
        }
    }
    /** **************************************************************************/
    /* Don't touch anything below this line unless you know what you are doing. */
    /** **************************************************************************/
    const getInputData = () => {
        const getInput = new GetInputData();
        return getInput.run();
    };
    exports.getInputData = getInputData;
    const map = (context) => {
        try {
            const map = new Map(context);
            return map.run();
        }
        catch (e) {
            log.error("MAP_STAGE_EXCEPTION", e);
        }
    };
    exports.map = map;
    const reduce = (context) => {
        try {
            const reduce = new Reduce(context);
            return reduce.run();
        }
        catch (e) {
            log.error("REDUCE_STAGE_EXCEPTION", e);
        }
    };
    exports.reduce = reduce;
    const summarize = (summary) => {
        const summarize = new Summarize(summary);
        return summarize.run();
    };
    exports.summarize = summarize;
});
