<template>
  <div>
    <b-modal title="Chỉnh sửa" v-model="isShowDetailForm"> </b-modal>
    <b-sidebar
      width="500px"
      backdrop
      title="Chi tiết SMS"
      no-header-close
      v-model="isShowDetailMessage"
      right
      shadow
    >
      <BCard>
        <DxForm :col-count="2" :form-data="sms">
          <DxSimpleItem data-field="ArClientCode">
            <DxLabel text="Công ty"
          /></DxSimpleItem>
          <DxSimpleItem data-field="ArAccountCode">
            <DxLabel text="Tài khoản"
          /></DxSimpleItem>

          <DxSimpleItem data-field="Amount">
            <DxLabel text="Giá trị"
          /></DxSimpleItem>
        </DxForm>
      </BCard>
      <DxButton
        type="default"
        style="margin-top: 12px; margin-left: 12px"
        text="Cập nhật"
        @click="handleSubmit"
      />
    </b-sidebar>

    <h2 class="content-block">Danh sách</h2>
    <div class="my-card">
      <BRow>
        <BCol sm="3">
          <div class="form-item">
            <label>Công ty</label>
            <dx-text-box
              @value-changed="(e) => handleChangeData(e, 'ArClientCode')"
            />
          </div>
        </BCol>
        <BCol sm="3">
          <div class="form-item">
            <label>Tài khoản</label>
            <dx-text-box
              @value-changed="(e) => handleChangeData(e, 'ArAccountCode')"
            />
          </div>
        </BCol>
        <BCol sm="3">
          <div class="form-item">
            <label>Loại ngày</label>
            <dx-text-box
              @value-changed="(e) => handleChangeData(e, 'DateType')"
            />
          </div>
        </BCol>
        <BCol sm="3">
          <div class="form-item">
            <label>Từ ngày</label>
            <dx-date-box
              @value-changed="(e) => handleChangeData(e, 'FromDate')"
              :value="req.FromDate"
              :show-borders="true"
            />
          </div>
        </BCol>
        <BCol sm="3">
          <div class="form-item">
            <label>Đến ngày</label>
            <dx-date-box
              @value-changed="(e) => handleChangeData(e, 'ToDate')"
              :value="req.FromDate"
              :show-borders="true"
            />
          </div>
        </BCol>
      </BRow>

      <dx-button
        size="sm"
        type="default"
        style="margin-top: 20px"
        @click="handleSearchData"
        text="Search"
      />
    </div>
    <div style="display: flex; justify-content: right">
      <DxButton
        :disabled="selectedMessages.length <= 0"
        type="default"
        style="margin-bottom: 20px; margin-right: 20px"
        text="Send"
      />
    </div>

    <dx-data-grid
      @row-removing="onDeleteRow"
      ref="dataGrid"
      @row-click="clickRow"
      class="dx-card wide-card"
      @selection-changed="onSelectionChanged"
      key-expr="Id"
      :show-borders="true"
      :columns="columns"
      :data-source="dataSource"
    >
      <dx-paging :page-size="10" />
      <dx-pager :show-page-size-selector="true" :show-info="true" />
      <dx-filter-row :visible="true" />
      <DxSelection
        :select-all-mode="allPages"
        :show-check-boxes-mode="always"
        mode="multiple"
      />
      <dx-column data-field="ArClientCode" caption="Công ty" />

      <dx-column
        data-field="ArAccountCode"
        caption="Tài khoản"
        :hiding-priority="8"
      />

      <dx-column
        data-field="Amount"
        caption="Giá trị"
        alignment="center"
        cell-template="cellTemplate"
      />
      <dx-column
        data-field="MessageDate"
        data-type="date"
        alignment="center"
        caption="Ngày tạo"
      />
      <DxEditing :allow-deleting="true" mode="row" />
      <!-- 'batch' | 'cell' | 'form' | 'popup' -->

      <template #cellTemplate="{ data }">
        <div>{{ formatNumber(data.value) }}</div>
      </template>
    </dx-data-grid>
  </div>
</template>

<script>
import DxButton from "devextreme-vue/button";
import DxTextBox from "devextreme-vue/text-box";
import DxForm, { DxLabel, DxSimpleItem } from "devextreme-vue/form";

/* import numeral from "numeral"; */

import DxDataGrid, {
  DxColumn,
  DxFilterRow,
  DxEditing,
  DxSelection,
  DxPager,
  DxPaging,
} from "devextreme-vue/data-grid";

import axios from "axios";

import DxDateBox from "devextreme-vue/date-box";
import { BRow, BCol, BSidebar, BCard, BModal } from "bootstrap-vue";
import moment from "moment";

import "devextreme/dist/css/dx.light.css";
import { defaultReq, defaultValue } from "@/utils/request";

export default {
  data() {
    return {
      toastOption: {
        visible: false,
        type: "success",
        message: "Thành công",
      },
      sms: {},
      dataSource: [],
      isShowDetailMessage: false,
      isShowDetailForm: false,

      selectedMessages: [],
      req: {
        ...defaultReq,
        ArClientCode: "",
        ArAccountCode: "",
        DateType: "",
      },
    };
  },
  methods: {
    onDeleteRow(e) {
      axios
        .post(
          "https://pilot.ezgolf.vn/api/AR_DSMS01/Process",
          {
            IdPaymentDetail: e.data.Id,

            ...defaultValue,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data.Status === "200") {
            this.$notify({
              type: "success",
              text: "Xóa thành công",
            });
            this.getData();
          } else {
            this.$notify({
              type: "error",
              text: res.data.Messages[0].MessageText,
            });
          }
        });
    },
    handleSubmit() {
      axios
        .post(
          "https://pilot.ezgolf.vn/api/AR_USMS01/Process",
          {
            ...this.sms,
            Amount: Number(this.sms.Amount),
            ...defaultValue,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data.Status === "200") {
            this.$notify({
              type: "success",
              text: "Cập nhật thành công",
            });
            this.getData();
          } else {
            this.$notify({
              type: "error",
              text: res.data.Messages[0].MessageText,
            });
          }
        });
    },
    showDetailForm() {
      this.isShowDetailForm = true;
    },
    clickRow(e) {
      this.isShowDetailMessage = true;
      axios
        .post(
          "https://pilot.ezgolf.vn/api/AR_RSMS02/Process",
          {
            IdPaymentDetail: e.data.Id,
            ...defaultValue,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data.Status === "200") {
            this.sms = res.data.Data;
          }
        });
    },

    onSelectionChanged(e) {
      this.selectedMessages = e.selectedRowsData;
    },
    formatNumber(num) {
      return num;
    },
    handleSearchData() {
      this.getData({
        ...this.req,
        FromDate: moment(this.req.FromDate, "YYYY/MM/DD"),
        ToDate: moment(this.req.ToDate, "YYYY/MM/DD"),
      });
    },
    handleChangeData(e, type) {
      this.req[type] = e.value;
    },

    getData() {
      axios
        .post("https://pilot.ezgolf.vn/api/AR_RSMS01/Process", this.req, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.Status === "200") {
            this.dataSource = res.data.Data.ListPaymentSMS;
          }
        });
    },
  },
  watch: {
    sms(newValue, value) {
      console.log({ newValue, value }, "2399");
    },
  },
  created() {
    this.getData();
  },
  components: {
    DxDataGrid,
    DxColumn,
    BCard,
    DxFilterRow,

    DxDateBox,

    DxButton,
    BRow,
    DxForm,
    BCol,
    BModal,
    DxEditing,
    BSidebar,

    DxPager,
    DxSelection,
    DxPaging,
    DxTextBox,
    DxSimpleItem,
    DxLabel,
  },
};
</script>
<style scoped>
.my-card {
  width: 100%;
  padding: 10px;
  background-color: #fff;
  margin-bottom: 32px;
  border: 1px solid #ebe9f1;
}
.form-item {
  margin-right: 30px;
}
.my-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
