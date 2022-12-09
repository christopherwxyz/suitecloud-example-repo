/**
 * @NAPIVersion 2.1
 * @NScriptType MapReduceScript
 */

import * as log from "N/log";
import * as search from "N/search";
import { EntryPoints } from "N/types";

import MapContext = EntryPoints.MapReduce.mapContext;
import ReduceContext = EntryPoints.MapReduce.reduceContext;
import SummarizeContext = EntryPoints.MapReduce.summarizeContext;

/**
 * GetInputData
 */
class GetInputData {

    /**
     * Returns an object containing search data.
     * @return {object} The search data object.
     */
    run(): object {
        const searchResult = search.load({ id: "customsearch_example" });
        return searchResult;
    }
}

/**
 * Map
 * @param {MapContext} context - The context to be used by the map.
 */
class Map {

    /**
     * Create Map.
     * @param {MapContext} context - The context to be used by the map.
     */
    constructor(private context: MapContext) { }

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

    /**
     * Create Reduce.
     * @param {ReduceContext} context - The context to be used by the reduce operation.
     */
    constructor(private context: ReduceContext) { }

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
    private doSomething(key, value) {
        log.debug('doSomething', key);
        return value;
    }
}


/**
 * Summarize
 * @param {SummarizeContext} summary - The context to be used for summarizing the data.
 */
class Summarize {

    /**
     * Create Summarize.
     * @param {SummarizeContext} summary - The context to be used for summarizing the data.
     */
    constructor(private summary: SummarizeContext) { }

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

export const getInputData: EntryPoints.MapReduce.getInputData = () => {
    const getInput = new GetInputData();
    return getInput.run();
};

export const map: EntryPoints.MapReduce.map = (context: MapContext) => {
    try {
        const map = new Map(context);
        return map.run();
    } catch (e) {
        log.error("MAP_STAGE_EXCEPTION", e);
    }
};

export const reduce: EntryPoints.MapReduce.reduce = (context: ReduceContext) => {
    try {
        const reduce = new Reduce(context);
        return reduce.run();
    } catch (e) {
        log.error("REDUCE_STAGE_EXCEPTION", e);
    }
};

export const summarize: EntryPoints.MapReduce.summarize = (summary: SummarizeContext) => {
    const summarize = new Summarize(summary);
    return summarize.run();
};