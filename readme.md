# Guide To Use Vue.js in Currently CakePHP project (TMS Module Only)
### vue version @3.2.36
vue@3.2.36\
minified
https://unpkg.com/vue@3.2.36/dist/vue.global.prod.js

dev with comment
https://unpkg.com/vue@3.2.36/dist/vue.global.js

official site
https://vuejs.org/guide/quick-start.html

To enforce code style and reduce error, project is configured with ESlint and Prettier by setting up a node project (only for linting, no other usage). Please run `npm i` or `yarn` and install corresponding VSCode extension.

<br>

---

<br>

## Entry Point
To use vue.js in the project, you must use ctp file to serve as an entry point for receiving props. Call this in your view file:


```php
echo $this->element('vue_component',[
    // data to be pass as props
    'data' => $data,
    // pass necessary translation
    'translation' => [
        'some_translate' => __d('tms', 'some_translate')
    ],
    //not necessary. will random generate a unique selector if not provided.
    'selector' => $someUniqueSelector, 
    'components' => [
        // must include one (and only one) view file in the pattern of [filename]View to serve as entry point
        'someView',
        // components that will be used in [someView] must be included
        'componentB',
        'componentA', 
        ...
    ],
]);
```

All view and component files are located inside `Tms/webroot/js/vuejs/src/`.
- `components` should be put to `Tms/webroot/js/vuejs/src/components/`
- `views` should be put to `Tms/webroot/js/vuejs/src/views/`
  
A file mapping is declared in `vue_component.ctp` located in `Tms/View/Elements`.\
See the following:

```php
$importMapping = [
    'ExtraPreferenceView' => '/tms/js/vuejs/src/views/extraPreference/ExtraPreferenceView.js',
    'VueModalDialogComponent' => '/tms/js/vuejs/src/components/common/VueModalDialogComponent.js',
    ...
    // any newly added file must de added here
];
```

You can also change to automatically find all available file by scanning the directory recursively:

```php
// can recursively find all js file in '../Plugin/Tms/webroot/js/vuejs/src'
// but may cause performance impact ?
$scanDeep = function ($rootPath, $recursive) {
    if ($handle = opendir($rootPath)) {
        $mapping = [];
        $result = [];
        while (false !== ($entry = readdir($handle))) {
            if ($entry != "." && $entry != "..") {
                $cur = $rootPath.'/'.$entry;
                if (is_dir($cur)) {
                    $result = array_merge($result, $recursive($cur, $recursive));
                } else {
                    // only include js file
                    if (preg_match('/[A-Za-z0-9]+\.js/', $entry)) {
                        $entry = str_replace('.js', '', $entry);
                        $mapping[$entry] = str_replace(
                            '../Plugin/Tms/webroot/js/vuejs/src',
                            '/tms/js/vuejs/src',
                            $cur
                        );
                    }
                }
            }
        }
        closedir($handle);
        return array_merge($mapping, $result);
    }
};

$importMapping =  $scanDeep('../Plugin/Tms/webroot/js/vuejs/src', $scanDeep);
```

The `vue_component.ctp` is predefined to include essential files
- `Tms/webroot/js/vuejs/vue.global.prod.js` 
- `Tms/webroot/js/vuejs/src/utils/commonUtils.js`

The `commonUtils.js` is a small library to provid useful function like debounce / throttle... You can add your new function into it.

After adding essential files to html head (once), The `vue_component.ctp` will add the components/views you stated to html head (once). It will then assign the necessary props passed by server to global window object, and call the `Tms/webroot/js/vuejs/entry.js`  in inline script.

```js
  // this will be called and add props to window, and will delete after component mounted
  this.vueReferenceProperty = {
    data: JSON.parse('<?php echo json_encode($data); ?>'),
    translation: JSON.parse('<?php echo json_encode($translation); ?>'),
    components: JSON.parse('<?php echo json_encode($components); ?>'),
    importMapping: JSON.parse('<?php echo json_encode($importMapping); ?>'),
    uniqSelector: '#<?php echo $uniqSelector; ?>'
  };
```

The `Tms/webroot/js/vuejs/entry.js` will read the props and initialize `vue.js`.

<br>

---

<br>

## Vue.js Views/Components
In general cases, using `type="module"` will be easier to handle:
```html
<script type="module">
    import { componentA } from '../paths/ComponentA.js'
</script>
```
But does not like normal npm module which will compiled by  directly import module file will have cache issue, you need to add version number to the end, like `../paths/ComponentA.js?v=12345` to get updated version. And it is quite dumb to add a timestamp manually. So all the js here we are using `type="text/javascript"`.

<br>

---

<br>

## Example of a Vue Component

```js
// eslint-disable-next-line no-unused-vars
var ComponentA = (function (exports) {  // must use a unique name to declare in global
    'use strict';
    // global var
    const { Vue } = window;

    // template. the html comment use "es6-string-html" extemsion to style html str
    const templateStr = /*html*/ `
    <div>
        <button type="button" @click="countOnClick" > {{count}} </button>
        <SomeComponent :propsToBePass="count" >
            <!-- child -->
        </SomeComponent>
    </div>
  `;

    // script
    const ComponentA = () => ({
        template: templateStr,
        props: {
            someProps: Object,
            someFunc: Function
        },
        setup(props) {
            const { ref, onMounted, computed } = Vue;
            const count = ref(0);

            const countOnClick = () => {
                count.value ++;
                props.someFunc();
            }

            onMounted(() => {
                console.log('component mounted!');
            });

            return { count };
        },
    });

    exports.ComponentA = ComponentA;
    Object.defineProperty(exports, '__esModule', { value: true });
    return exports;
})({});


```



