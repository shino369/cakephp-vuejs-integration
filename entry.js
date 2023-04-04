(function () {
    // global var
    const { Vue, commonUtils, vueReferenceProperty } = window;
    try {
        commonUtils.exec(() => {
            const { createApp } = Vue;
            let { data, components, importMapping, uniqSelector, translation: _translate } =
                vueReferenceProperty;

            if (!components || !components.length) {
                throw new Error('No View or Component is imported.');
            }

            if (!data || Array.isArray(data)) {
                // json_encode cannot return object if php return empty map
                data = {};
            }

            // define entry View
            let template = '';
            if (components.length > 0) {
                const viewRegex = /[A-Za-z0-9]+View/;
                const view = components.filter((c) => c.match(viewRegex));

                if (!view.length) {
                    throw new Error(
                        'No View is imported. Please check if you entered a wrong name (case-sensitive).',
                    );
                }

                if (view.length > 1) {
                    throw new Error('More than one View is imported.');
                }

                template = `<${view[0]} :data="data" />`;
            }

            const app = createApp({
                template,
                setup: () => ({ data }),
            });

            // add components
            if (components.length > 0) {
                components.forEach((comp) => {
                    const funcComp = this[comp];

                    if (!funcComp) {
                        const available = Object.keys(importMapping).filter(
                            (n) =>
                                new RegExp(comp, 'i').test(n) ||
                                new RegExp(n, 'i').test(comp),
                        );
                        throw new Error(
                            `Component or view [${comp}] not found. Perhaps a wrong filename. ${
                                available.length
                                    ? `Possible filename maybe: ${available.join(
                                          ', ',
                                      )}`
                                    : ''
                            }`,
                        );
                    }
                    Object.entries(funcComp).forEach(([_key, exportFunc]) => {
                        if (!exportFunc || typeof exportFunc !== 'function') {
                            throw new Error(
                                `The export from Component or View [${_key}] should be a function`,
                            );
                        }
                        app.component(comp, exportFunc());
                    });
                });
            }

            app.mount(uniqSelector);
        }, true);
    } catch (err) {
        console.error(err);
    }
})();
