<?php 
/**
 * Author: shino369
 * component props
 * @param array data        fields data
 * @param array translation translation 
 * @param string selector   unique selector for rendering vue
 * @param array components  component to be imported
 */

// initialize
$data = isset($data) ? $data : [];
$translation = isset($translation) ? $translation : [];
$essentials = [
    /*'Vue' =>*/ '/js/vuejs/vue.global.prod.js',
    /*'commonUtils' =>*/ '/js/vuejs/src/utils/commonUtils.js',
];

$importMapping = [
    'ExtraPreferenceView' => '/js/vuejs/src/views/extraPreference/ExtraPreferenceView.js',
    'VueModalDialogComponent' => '/js/vuejs/src/components/common/VueModalDialogComponent.js',
];

$compMap = [];
$components = isset($components) ? $components : [];

foreach ($components as $component) {
    if (!empty($importMapping[$component])) {
        $compMap[] = $importMapping[$component];
    }
}

$this->Html->script($essentials, false);

if (count($compMap) > 0) {
    $this->Html->script($compMap, false);
}

$uniqSelector = isset($selector) && !empty($selector) ? $selector : $uniqSelector = uniqid('vue-');
?>

<div id="<?php echo $uniqSelector; ?>"></div>

<script>
  // add to window
  this.vueReferenceProperty = {
    data: JSON.parse('<?php echo json_encode($data); ?>'),
    translation: JSON.parse('<?php echo json_encode($translation); ?>'),
    components: JSON.parse('<?php echo json_encode($components); ?>'),
    importMapping: JSON.parse('<?php echo json_encode($importMapping); ?>'),
    uniqSelector: '#<?php echo $uniqSelector; ?>'
  };
</script>

<?php
 echo $this->Html->script('/js/vuejs/entry.js', ['inline' => true, 'once' => false]);
?>

<script>
  // release from window
  delete this.vueReferenceProperty;
</script>

<?php 
    /* 
        FOR FUTURE USAGE (?)

        type=module are supported since 2017. We can use module to ensure scope separation for each code block
        but the server genereally configured to refer to a cached file forever if not adding a timestamp or version for the file
        
        this will work, but dumb as fk:

        <script type="module">
        import { createApp } from '<?php echo $this->webroot.'/js/vuejs/vue.esm-browser.prod.js?'.(floor(microtime(true) / 10) * 10);?>'
        import { ExtraPreference } from '<?php echo $this->webroot.'/js/vuejs/components/extraPreference/ExtraPreference-esm.js?'.(floor(microtime(true) / 10) * 10); ?>'
        ...

        </script>
        
        it can solve by using cdn serve directly 
        or can use importmap to define the timestamp at once, but the browser support is still poor (see import_vue.ctp)


        Define import mapping. After that you can directly import it from ctp, e.g.
        in ctp view, call this on top:

        include once in parent file only!!
        echo $this->element('import_vue', [
            'modules' => ['vue', 'utils'],
            'components' => ['ExtraPreference']
        ]);

        then you can use 'import' statement:

        <script type="module">  // type must be module
            import { ref, createApp } from 'vue'
            import { pipe } from 'utils'
            import { ComponentA } from 'ComponentA'
            createApp({
                tempalte: `
                    <ComponentA />
                `,
                components: {
                    ComponentA
                },
                setup() {
                    const count = ref(0)
                    const increment = (e) => {
                        count.value++
                        console.log(count.value)
                    }
                    return {
                        count, 
                        increment,
                    }
                }
            }).mount('#vue-app')
        </script>

    */

    /*
        $functionMapping = [
            'vue' => $this->webroot.'/js/vuejs/vue.esm-browser.prod.js',
            'utils' => $this->webroot.'/js/utils/commonUtils-esm.js',
        ];

        $componentMapping = [
            'ExtraPreference' => $this->webroot.'/js/vuejs/components/extraPreference/ExtraPreference-esm.js'
        ];

        $mapArr = [];

        if (isset($modules)){
            foreach ($modules as $module) {
                if (!empty($functionMapping[$module])) {
                    $mapArr[$module] = $functionMapping[$module];
                }
            }
        }

        if (isset($components)) {
            foreach ($components as $component) {
                if (!empty($componentMapping[$component])) {
                    $mapArr[$component] = $componentMapping[$component].'?'.floor(microtime(true) * 1000);
                }
            }
        }

        // safari support from version 16.4 (March, 2023), shall not use import map for now 
        // wait until IOS 17 or 18 release

        $support = false;

        if(count($mapArr) > 0 && $support) {
            $moduleMap = $this->Html->tag(
                'script',
                json_encode([
                    "imports" => $mapArr
                ]),
                [	
                    'type' => 'importmap',
                    'inline' => false,
                    'once' => false
                ]
            );
            $this->append('script',  $moduleMap);
        }
    */

?>