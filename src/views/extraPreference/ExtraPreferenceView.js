// eslint-disable-next-line no-unused-vars
var ExtraPreferenceView = (function (exports) {
    'use strict';
    // global var
    const { Vue } = window;

    // template
    const templateStr = /*html*/ `
    <div type="button" class="dialog-btn btn btn-block btn-lg" style="margin-bottom: 0.5rem;" @click="showDialog(true)">show_options</div>
    <div class="selected-grid">
      <div style="display: flex; align-items: center; flex-wrap: wrap;"> 
        <div style="width: 130px;">selectedSet: </div>
        <div class="option-item option-selected" v-for="tag in Array.from(selectedSet)"> {{tag}} </div>
      </div>
      <div style="display: flex; align-items: center; flex-wrap: wrap;"> 
        <div style="width: 130px;">guestSelectedSet: </div>
        <div class="option-item option-selected" v-for="tag in Array.from(guestSelectedSet)"> {{tag}} </div>
        <!-- tag here -->
      </div>
      <div 
        class="js-input-data form-control"
        :style="{
          padding: '0.5rem',
          height: '10rem',
          overflow: 'auto',
          margin: '0.5rem',
          width: 'unset'
        }">
        Lorem ipsum dolor sit amet, vix albucius delectus comprehensam in, facilis accusata voluptatibus cu pri. Laudem doming est ne, sed vocent denique delectus ex. Vim no quas assum moderatius, in pri torquatos voluptaria. Et ius unum fuisset voluptua, vim an omittantur repudiandae. Mucius detracto ne per, quando nusquam ei pri. Ad nec quis mollis incorrupte, his verear pericula cu.
        Invenire definitiones ius ea, iriure mentitum contentiones pri ne. Eu mel atqui labitur elaboraret. Mel eu malorum dolorum gloriatur, ei enim posse his. Inani doctus dissentiunt duo in.
        Legendos sadipscing an eam, dolor dissentiet cu per. At mea malorum mediocritatem. Te eripuit sapientem has. Sea summo blandit tacimates ad, sea ei persecuti cotidieque.
        Mei et amet admodum noluisse, vix alienum epicurei at, malorum feugait sed in. Veritus repudiandae eos cu. Oblique appetere cotidieque usu cu. Integre disputando voluptatibus ea has, ipsum reprehendunt vis ad. Quem putant pri at. Tamquam efficiantur ad duo.
        Id modo paulo mel. Augue epicurei appareat in eam, pro minim viderer repudiandae et. Erroribus accommodare quo ne. Facer zril legendos pro at, probo vocent diceret no duo, quo no augue delenit conclusionemque. Assum solet alterum no vix, usu facer eruditi facilis at, his an agam cibo omnium.
      </div>
      <div style="display: flex; align-items: center;"> 
        <input
          :id="data.id + data.seq"
          type="checkbox"
          :style="{
            marginTop: 0,
            marginRight: '0.5rem'
          }"
        />
        <label :for="data.id + data.seq" style="margin-bottom: 0;"> I agree </label>
      </div>
    </div>

    <VueModalDialogComponent :showDialog="showDialog" :show="show">
      <div class="switch-tab-row">
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
      <div class="selected-list-row">
          selected:
      </div>
      <div class="option-inner-container" id="scroll-container">
          <div v-for="option in options" @click="optionOnClick(option.value)" class="option-item"
            :class="{
              'option-selected': showList.has(option.value)
            }"
          >
              {{option.label}}
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
        },
        setup(_props) {
            const { ref, onMounted, computed } = Vue;
            const count = ref(0);
            const testArray = ref([]);
            const show = ref(false);

            const options = new Array(80).fill(0).map((_arr, index) => ({
                label: `option ${index + 1}`,
                value: index + 1,
            }));

            const selectedSet = ref(new Set());
            const guestSelectedSet = ref(new Set());
            const activeTab = ref('YOURS');

            onMounted(() => {
                // console.log(props.data);
            });
            const showList = computed(() =>
                activeTab.value === 'YOURS'
                    ? selectedSet.value
                    : guestSelectedSet.value,
            );
            const showDialog = (s) => {
                show.value = s;
            };

            const tabOnClick = (e) => {
                activeTab.value = e;
            };

            const optionOnClick = (e) => {
                if (activeTab.value === 'YOURS') {
                    selectedSet.value.has(e)
                        ? selectedSet.value.delete(e)
                        : selectedSet.value.add(e);
                } else {
                    guestSelectedSet.value.has(e)
                        ? guestSelectedSet.value.delete(e)
                        : guestSelectedSet.value.add(e);
                }
            };

            return {
                count,
                testArray,
                options,
                selectedSet,
                guestSelectedSet,
                activeTab,
                show,
                showList,
                showDialog,
                tabOnClick,
                optionOnClick,
            };
        },
    });

    exports.ExtraPreferenceView = ExtraPreferenceView;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;
})({});
