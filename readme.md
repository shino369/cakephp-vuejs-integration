# Guide To Hybridly Use Vue.js in old CakePHP project
### vue version @3.2.36
vue@3.2.36\
minified
https://unpkg.com/vue@3.2.36/dist/vue.global.prod.js

dev with comment
https://unpkg.com/vue@3.2.36/dist/vue.global.js

official site
https://vuejs.org/guide/quick-start.html


To enforce code style and reduce error, project is configured with ESlint and Prettier by setting up a node project.\
Please run `npm i` or `yarn` and install corresponding module, and install the above VScode extension.\
To start development, run `npm run dev` or `yarn dev`. It will create minified js file and copy to the webroot path automatically on file change. Run `npm run build` or `yarn build` for building only.

<br>

---

<br>

## Introduction

The main purpose of this project is to partially integrate `vue.js` into some very old `CakePHP` project already with a lot of view file using `jquery` and complex business logic. By applying this, you can partially include vuejs component along with your old code.

For example:

```php
<?php
// old php shit
echo '<div id="shit">some</div>'
    .'<div>shit</div>';
?>
<script>
    // old jquery shit
    $('#shit').click(() => {...})
</script>

<?php
// entry point to use vuejs, see vue_component.ctp and entry.js for reference
echo $this->element('vue_component',[
        ... // props
    ]);
?>
```
<br>

---

<br>

## Entry Point
To hybridly use vue.js in cakephp project (consider it is generally an old project), you must use ctp file to serve as an entry point for receiving server-side props. We will use a ctp file `vue_component.ctp` to do it. Put the file into `/View/Elements/` directory, and call this in your view file:


```php
echo $this->element('vue_component',[
    // data to be pass as props
    'data' => $data,
    // pass necessary translation
    'translation' => [
        'some_translate' => __('some_translate')
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

Then for that specific part you can use vue.js to develop.

All view and component files should be located inside `/webroot/js/vuejs/src/`.
- `components` should be put to `/webroot/js/vuejs/src/components/`
- `views` should be put to `/webroot/js/vuejs/src/views/`
  
A file mapping is declared in `vue_component.ctp` located in `View/Elements`.\
See the following:

```php
// read mapping from constructed json
$importMapping = [];
$mapPath = '../webroot/js/vuejs/src/fileMapping.json';   // this json file is created by running yarn build in the vue project
// $mapPath = str_replace(array('/', '\\'), DIRECTORY_SEPARATOR, $mapPath);
$handle = fopen($mapPath, "r");
$contents = fread($handle, filesize($mapPath));
fclose($handle);

if (isset($contents)) {
  $importMapping = json_decode($contents, true);
}
```

In case of any error, chnage to use manual hardcode for mapping.


The `vue_component.ctp` is predefined to include essential files
- `/webroot/js/vuejs/vue.global.prod.js` 
- `/webroot/js/vuejs/src/utils/commonUtils.js`

The `commonUtils.js` is a small library to provid useful function like debounce / throttle... You can add your new function into it.

After adding essential files to html head (once), The `vue_component.ctp` will add the components/views you stated to html head (once). It will then assign the necessary props passed by server to global window object, and call the `/webroot/js/vuejs/src/entry.js`  in inline script.

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

The `/webroot/js/vuejs/src/entry.js` will read the props and initialize `vue.js`.

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
But does not like normal npm module which will compiled by webpack and adding postfix, directly import module file will have cache issue, you need to add version number to the end, like `../paths/ComponentA.js?v=12345` to get updated version. And it is quite dumb to add a timestamp manually. So all the js here we are using `type="text/javascript"` so that cakephp can automatically add a timestamp to it. (a more modern method will be using `importmap` and declare all at once, but the browser support is still poor.)

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



