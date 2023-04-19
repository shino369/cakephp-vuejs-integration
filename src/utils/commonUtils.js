(function (exports) {
    'use strict';

    /**
     * @typedef {{
     *  data: {
     *  [key:string]: any
     *  }
     *  translation: {
     *  [key:string]: string
     *  }
     *  components: string[]
     *  uniqSelector: string
     * }} vueProp
     */

    /**
     * @typedef {{[key:string]: () => any}} modules
     */

    /**
     * @type {vueProp[]}
     */
    const vueReferenceProperty = [];

    function getProps() {
        return vueReferenceProperty.pop();
    }

    /**
     *
     * @param {vueProp} props
     */
    function setProps(props) {
        vueReferenceProperty.push(props);
    }

    /**
     * @type {Map<string, modules>}
     */
    const vueComponent = new Map();

    /**
     *
     * @param {string} name
     * @returns
     */
    function getComp(name) {
        try {
            if (!vueComponent.has(name)) {
                throw new Error(`Component ${name} does not exist`);
            }
            return vueComponent.get(name);
        } catch (error) {
            console.warn(error);
            return undefined;
        }
    }

    /**
     *
     * @param {string} name
     * @param {modules} comp
     */
    function setComp(name, comp) {
        if (!vueComponent.has(name)) {
            vueComponent.set(name, comp);
        }
    }

    /**
     * exec function when dom loaded. can directly use it to declare
     * @param {() => void} domReadyAction
     * @param {boolean} instant
     */
    function exec(domReadyAction, instant = false) {
        if (instant) {
            domReadyAction();
        } else {
            const load = window.onload;
            window.onload = () => {
                // concat func
                load && load();
                domReadyAction();
            };
        }
    }

    /**
     * debounce function
     * @param {Function} callback
     * @param {number} wait
     * @returns
     */
    function debounce(callback, wait) {
        let timeoutId = null;
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                callback.apply(null, args);
            }, wait);
        };
    }

    /**
     * debounce function
     * @param {Function} callback
     * @param {number} wait
     * @returns
     */
    function throttle(callback, wait) {
        let prev = 0;
        return (...args) => {
            let now = new Date().getTime();
            if (now - prev > wait) {
                prev = now;
                return callback(...args);
            }
        };
    }

    const consoleStyle = `color: white; background: #483D8B; padding: 0.25rem;`;
    /**
     *
     * @param {string} str
     * @param {string} style
     */
    const styledLog = {
        log: (str, style = undefined) =>
            console.log(`%c ${str}`, style || consoleStyle),
        error: (str) =>
            console.log(
                `%c ${str} `,
                `color: white; background: #8b0000; padding: 0.25rem;`,
            ),
    };

    /**
     *
     * @param {string} url
     * @param {{[key:string]: any}} params
     * @returns
     */
    async function apiGet(url, params = {}) {
        let paramStr = new URLSearchParams(params).toString();
        paramStr = paramStr ? '?' + paramStr : paramStr;
        const res = await fetch(url + paramStr);
        const jsonData = await res.json();
        return jsonData;
    }

    // piping utils
    const pipe =
        (...fns) =>
        (x) =>
            fns.reduce((v, f) => f(v), x);

    const flattenArray = (input) =>
        input.reduce(
            (acc, item) => [...acc, ...(Array.isArray(item) ? item : [item])],
            [],
        );

    const map = (fn) => (input) => input.map(fn);
    const mapTo = (a) => (input) => input.map((_) => a);

    /**
     *
     * @param {string[]} comps
     */
    const registerComponent = (comps) => {
        let components = {};
        comps.forEach((comp) => {
            try {
                const modules = getComp(comp);
                if (modules) {
                    const childModules = Object.entries(modules).reduce(
                        (accu, [compKey, func]) => ({
                            ...accu,
                            [compKey]: func(),
                        }),
                        {},
                    );

                    components = {
                        ...components,
                        ...childModules,
                    };
                }
            } catch (error) {
                console.warn(error);
            }
        });
        return components;
    };

    /**
     *
     * @param {string} key
     * @param {{[key:string]: () => any}} modules
     */
    const mount = (key, modules) => {
        Object.defineProperty(modules, '__esModule', { value: true });
        setComp(key, modules);
    };

    exports.getProps = getProps;
    exports.setProps = setProps;
    exports.getComp = getComp;
    exports.setComp = setComp;
    exports.mount = mount;
    exports.exec = exec;
    exports.debounce = debounce;
    exports.throttle = throttle;
    exports.styledLog = styledLog;
    exports.pipe = pipe;
    exports.map = map;
    exports.mapTo = mapTo;
    exports.flattenArray = flattenArray;
    exports.apiGet = apiGet;
    exports.registerComponent = registerComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

    // register to window
    window.commonUtils = exports;
})({});
