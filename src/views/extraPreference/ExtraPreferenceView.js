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
    type="button" 
    class="dialog-btn btn btn-block btn-lg"
    style="margin-bottom: 0.5rem; display: flex; align-items: center; font-size: 12px;"
    @click="showDialog(true)"
  >
    show_options
    <VueIconComponent :imgProps="{
      src: data.icon.plus,
      style: {
        filter: 'brightness(5) grayscale(1)',
        marginLeft: '0.5rem',
      }
    }" />
  </div>
  <div v-if="form.selectedSet.size > 0 || form.guestSelectedSet.size > 0" class="selected-grid"
    style="font-size: 12px;"
  >
    <div style="display: flex; align-items: center; flex-wrap: wrap; padding-bottom: 0.5rem; border-bottom: 1px solid lightgray;"> 
      <div style="width: 130px;">your selected preference: </div>
      <div v-for="(tag, index) in Array.from(form.selectedSet)" :key="index" :style="{
        fontSize: '12px',
        margin: '0.25rem',
        marginLeft: 0,
        padding: 0,
        paddingLeft: '0.25rem',
        paddingRight: '0.25rem',
        borderRadius: '0.25rem',
        backgroundColor: index%2===0 ? 'lightsteelblue' : 'lightgray',
      }"> {{optionMap[tag]}} </div>
    </div>
    <div style="display: flex; align-items: center; flex-wrap: wrap;"> 
      <div style="width: 130px; font-size: 12px;">guest selected preference: </div>
      <div v-for="(tag, index) in Array.from(form.guestSelectedSet)" :key="index" :style="{
        fontSize: '12px',
        margin: '0.25rem',
        marginLeft: 0,
        padding: 0,
        paddingLeft: '0.25rem',
        paddingRight: '0.25rem',
        borderRadius: '0.25rem',
        backgroundColor: index%2===0 ? 'lightsteelblue' : 'lightgray',
      }"> {{optionMap[tag]}} </div>
      <!-- tag here -->
    </div>
    <div 
      class="js-input-data form-control"
      :style="{
        padding: '0.5rem',
        height: '10rem',
        overflow: 'auto',
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
        width: 'unset',
        fontSize: '10px',
      }">
        {{tnc}}
      </div>
    <div style="display: flex; align-items: center;"> 
      <input
        :id="data.id + data.seq"
        type="checkbox"
        v-model="form.agree"
        :style="{
          marginTop: 0,
          marginRight: '0.5rem'
        }"
      />
      <label :for="data.id + data.seq" style="margin-bottom: 0;"> I agree </label>
      <div 
        v-if="!form.agree" 
        :style="{
          marginLeft: '0.5rem',
          color: 'red',
        }"
      >{{error['tnc']}}</div>
    </div>
  </div>

  <VueModalDialogComponent :showDialog="showDialog" :show="show">
    <div class="switch-tab-row" style="padding-top: 1rem;">
        <div class="tab-item" @click="tabOnClick('YOURS')">
            <div class="text-abs">YOURS</div>
            YOURS
        </div>
        <div class="tab-item" @click="tabOnClick('YOUR GUESTS')">
            <div class="text-abs">YOUR GUESTS</div>
            YOUR GUESTS
        </div>
        <div 
          class="tab-layer"
          :class="{
            'translate-right': activeTab !== 'YOURS'
          }"
        ></div>
    </div>
    <div class="selected-list-row" :style="{
      display: 'flex',
      alignItems: 'center',
      minHeight: '45px',
      flexWrap: 'wrap',
      marginBottom: '1rem',
      paddingTop: '1rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid lightgray',
    }">
        <div style="margin-right:0.5rem;">selected: </div>
        <div v-for="(tag, index) in Array.from(showList)" :key="index" :style="{
          display: 'flex',
          alignItems: 'center',
          fontSize: '12px',
          margin: '0.25rem',
          marginLeft: 0,
          padding: 0,
          paddingLeft: '0.25rem',
          paddingRight: '0.25rem',
          borderRadius: '0.25rem',
          backgroundColor: index%2===0 ? 'lightsteelblue' : 'lightgray',
        }"> 
          {{optionMap[tag]}} 
          <VueIconComponent 
            style="cursor: pointer;"
            @click="optionOnClick(tag)"
            :imgProps="{
              src: data.icon.trash,
              style: {
                filter: 'grayscale(1)',
                marginLeft: '0.5rem',
              }
            }" 
          />
        </div>
    </div> 
    <div class="option-inner-container" id="scroll-container" :style="{
      flexDirection: 'column',
      paddingLeft: '1rem',
      paddingRight: '1rem',
    }">
          <div v-for="extraType in extraTypes">
            <div>
              {{extraType.type}}
            </div>
            <div :style="{
              display: 'flex',
              flexWrap: 'wrap'
            }"> 
              <div v-for="option in extraType.options" @click="optionOnClick(option.value)" class="option-item"
                :class="{
                  'option-selected': showList.has(option.value)
                }"
              >
                  {{option.label}}
              </div>
            </div>

          </div>

    </div>
    <div class="option-bottom-row">
    </div>
  </VueModalDialogComponent>
`;

    // script
    const ExtraPreferenceView = () => ({
        template: templateStr,
        props: {
            data: Object,
            t: Function,
        },
        components: {
            ...commonUtils.registerComponent([
                'VueModalDialogComponent',
                'VueIconComponent',
            ]),
        },

        /**
         * @typedef optionVal
         * @type {object}
         * @property {string} type - type.
         * @property {string} value - value.
         */

        /**
         * @param {{
         * data: {
         *    langKey:     string
         *    outletId:    string
         *    baseUrl:     string
         *    id:          string
         *    seq:         string
         *    type:        string
         *    show:        boolean
         *    required:    boolean
         *    validations: []
         *    name_l1:     string
         *    name_l2:     string
         *    name_l3:     string
         *    name_l4:     string
         *    name_l5:     string
         *    childType:   string
         *    params:      {
         *      mem_attribute_types:  optionVal
         *      terms_n_services_enable: optionVal
         *      terms_n_services_options: optionVal
         *    }
         *  }
         * t: (str:string) => string
         * }} props
         * @returns
         */
        setup(props) {
            const { ref, onMounted, computed, watch } = Vue;
            const { apiGet } = commonUtils;
            const baseUrl = props.data.baseUrl;
            const langKey = props.data.langKey;
            const count = ref(0);
            const testArray = ref([]);
            const show = ref(false);
            const extraTypes = ref([]);
            const optionMap = ref({});
            const tnc = ref('');
            const typeMapper = new Map();

            const error = {
                tnc: props.t('this_field_is_required'),
            };

            const activeTab = ref('YOURS');

            const form = ref({
                selectedSet: new Set(),
                guestSelectedSet: new Set(),
                agree: false,
            });

            watch(
                () => form.value,
                (newState, _oldState) => {
                    // update the form to original jquery form
                    const formData =
                        newState.selectedSet.size === 0 &&
                        newState.guestSelectedSet.size === 0
                            ? ''
                            : JSON.stringify({
                                  label: props.data.name_l1,
                                  selectedSet: Array.from(
                                      newState.selectedSet,
                                  ).map((id) => ({
                                      optionId: id,
                                      typeId: typeMapper.get(id),
                                  })),
                                  guestSelectedSet: Array.from(
                                      newState.guestSelectedSet,
                                  ).map((id) => ({
                                      optionId: id,
                                      typeId: typeMapper.get(id),
                                  })),
                                  tnc: {
                                      // typeId:
                                      id: props.data.params
                                          .terms_n_services_options.value,
                                      agree: newState.agree,
                                  },
                              });
                    // console.log(JSON.formData);

                    $('#ResvExtraPreference' + props.data.seq).val(formData);
                },
                {
                    deep: true,
                    // immediate: true,
                },
            );

            const fetchData = async () => {
                // fetch extra preference here
                const { outletId, params } = props.data;
                const res = await apiGet(
                    baseUrl + 'some_api_get_extra_preference',
                    {
                        outletId: outletId,
                        memAttributeTypeIds: params.mem_attribute_types.value,
                        tncId: params.terms_n_services_options.value,
                    },
                );
                // console.log(res);
                extraTypes.value = res.memAttributeTypes.map((mt) => {
                    return {
                        type: mt.MemAttributeType[`atyp_name_l${langKey}`],
                        id: mt.MemAttributeType.atyp_id,
                        options: mt.MemAttributeOption.map((op) => {
                            optionMap.value[op.atto_id] =
                                op[`atto_name_l${langKey}`];
                            typeMapper.set(
                                op.atto_id,
                                mt.MemAttributeType.atyp_id,
                            );
                            return {
                                label: op[`atto_name_l${langKey}`],
                                value: op.atto_id,
                            };
                        }),
                    };
                });
                tnc.value = res.tnc
                    .map((t) => t.TmsExtraType[`etyp_info_l${langKey}`])
                    .join();
            };

            onMounted(() => {
                // console.log('component mounted');
                // console.log(props.data);
                fetchData();
            });
            const showList = computed(() =>
                activeTab.value === 'YOURS'
                    ? form.value.selectedSet
                    : form.value.guestSelectedSet,
            );
            const showDialog = (s) => {
                show.value = s;
            };

            const tabOnClick = (e) => {
                activeTab.value = e;
            };

            const optionOnClick = (e) => {
                if (activeTab.value === 'YOURS') {
                    form.value.selectedSet.has(e)
                        ? form.value.selectedSet.delete(e)
                        : form.value.selectedSet.add(e);
                } else {
                    form.value.guestSelectedSet.has(e)
                        ? form.value.guestSelectedSet.delete(e)
                        : form.value.guestSelectedSet.add(e);
                }
            };

            return {
                count,
                testArray,
                extraTypes,
                tnc,
                activeTab,
                show,
                showList,
                optionMap,
                form,
                error,
                showDialog,
                tabOnClick,
                optionOnClick,
            };
        },
    });

    commonUtils.mount('ExtraPreferenceView', {
        ExtraPreferenceView,
    });
})();
