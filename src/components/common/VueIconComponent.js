(function () {
    'use strict';
    // global var
    const { Vue, commonUtils } = window;

    if (!Vue || !commonUtils) {
        throw new Error(`Vue.js and commonUtils.js not initialized.`);
    }

    // template
    const templateStr = /*html*/ `
    <div 
        :style="{
            width: imgProps.size,
            height: imgProps.size,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...(imgProps.style ? imgProps.style : {})
        }"
        v-html="img"
    >
    </div>
`;

    // component script
    const VueIconComponent = () => ({
        template: templateStr,
        props: {
            imgProps: Object,
        },
        /**
         *
         * @param {{
         *  imgProps: {
         *      src: string
         *      style: Object
         *      size: string
         * }
         * }} props
         * @returns
         */
        setup(props) {
            const { ref, onMounted } = Vue;
            const img = ref('');

            onMounted(() => {
                // console.log(props.imgProps.src);
                img.value = props.imgProps.src.replace(/\n/g, '"');
                // console.log(img.value);
            });

            return { img };
        },
    });

    commonUtils.mount('VueIconComponent', { VueIconComponent });
})();
