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
    /* 'component' =>*/ '/js/vuejs/src/component.js'
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
  window.commonUtils && window.commonUtils.setProps({
    data: JSON.parse('<?php echo json_encode($data); ?>'),
    translation: JSON.parse('<?php echo json_encode($translation); ?>'),
    components: JSON.parse('<?php echo json_encode($components); ?>'),
    uniqSelector: '#<?php echo $uniqSelector; ?>'
  });
</script>

<?php
 echo $this->Html->script('/js/vuejs/src/entry.js', ['inline' => true, 'once' => false]);
?>