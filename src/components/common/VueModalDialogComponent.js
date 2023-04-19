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
            @click="showDialog(false)"
            :style="{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1050,
            height: '100%',
            width: '100%',
            display: preState ? 'flex' : 'none',
            opacity: postState ? 1 : 0,
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'contrast(0.5)',
            transition: 'opacity 0.3s ease-in-out',
            overflow: 'hidden',
            }"
        >
          <div :style="{
              backgroundColor: 'white',
              width: '90%',
              maxWidth: '600px',
              height: '80%',
              position: 'relative',
              transition: 'transform 0.3s ease-in-out',
              transform: postState ? 'translateY(0)' : 'translateY(100vh)',
              'box-shadow': '10px 10px 5px 0px rgb(0 0 0 / 75%)',
              '-webkit-box-shadow': '0px 1px 5px 0px rgb(100 100 100 / 30%)',
              '-moz-box-shadow': '0px 1px 5px 0px rgb(100 100 100 / 30%)',
              'border-radius': '0.5rem',
              padding: '0.5rem',
              overflow: 'hidden',
            }"
            @click.stop
          >
            <div ref="headerRef" style="display: flex; align-items: center; justify-content: end; padding: 0.5rem; border-bottom: 1px solid #e5e5e5; " @click="showDialog(false)">
                <button type="button" class="close" data-dismiss="modal">×</button>
            </div>
            <div :style="{
                width: '100%',
                height:  bodyHeight,
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '0.5rem',
              }"
            >
              <slot></slot>
            </div>
          </div>
        </div>
    `;

    // component script
    const VueModalDialogComponent = () => ({
        template: templateStr,
        props: {
            showDialog: Function,
            show: Boolean,
        },
        setup(props) {
            const { ref, watch } = Vue;
            const preState = ref(false);
            const postState = ref(false);
            const headerRef = ref();
            const bodyHeight = ref(0);

            // internal state subscribed to props.show
            watch(
                () => props.show,
                (newState, _oldState) => {
                    if (newState) {
                        document.body.style.overflow = 'hidden';
                        preState.value = true;
                        setTimeout(() => {
                            postState.value = true;
                            if (headerRef.value) {
                                bodyHeight.value = `calc(100% - ${headerRef.value.clientHeight}px)`;
                            }
                        }, 50);
                    } else {
                        document.body.style.overflow = 'auto';
                        postState.value = false;
                        setTimeout(() => {
                            preState.value = false;
                        }, 100);
                    }
                },
            );

            return {
                preState,
                postState,
                headerRef,
                bodyHeight,
            };
        },
    });

    commonUtils.mount('VueModalDialogComponent', {
        VueModalDialogComponent,
    });
})();
