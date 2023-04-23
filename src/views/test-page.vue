<template>
  <div>
    <h2 class="content-block">Danh sách</h2>
    <div class="my-card">
      <BRow>
        <BCol sm="3">
          <div class="form-item">
            <label>From Date</label>
            <dx-date-box
              @value-changed="(e) => handleChangeData(e, 'FromDate')"
              :value="req.FromDate"
              :show-borders="true"
            />
          </div>
        </BCol>
        <BCol sm="3">
          <div class="form-item">
            <label>To Date</label>
            <dx-date-box
              @value-changed="(e) => handleChangeData(e, 'ToDate')"
              :value="req.ToDate"
              :show-borders="true"
            />
          </div>
        </BCol>
        <BCol sm="3">
          <div class="form-item">
            <label>Payment Code</label>
            <dx-text-box
              @value-changed="(e) => handleChangeData(e, 'PaymentCode')"
            />
          </div>
        </BCol>
        <BCol sm="3">
          <div class="form-item">
            <label>Payment Status</label>
            <DxSelectBox
              :show-clear-button="true"
              :items="paymentStatuses"
            
              @value-changed="(e) => handleChangeData(e, 'PaymentStatus')"
            />
          </div>
        </BCol>
        <BCol sm="3">
          <div class="form-item">
            <label>Distribution Status</label>
            <DxSelectBox
              :items="distributionStatuses"
         
              @value-changed="(e) => handleChangeData(e, 'DistributionStatus')"
            />
          </div>
        </BCol>
      </BRow>

      <dx-button
        type="default"
        style="margin-top: 20px"
        @click="handleSearchData"
        text="Search"
      />
    </div>
    <b-overlay :show="loading" rounded="sm">
      <dx-data-grid
        @selection-changed="onSelectionChanged"
        key-expr="Id"
        :show-borders="true"
        :data-source="dataSource"
      >
        <dx-column data-field="Id" alignment="center" :width="90" />

        <dx-column data-field="Payer" caption="Payer" />
        <dx-column data-field="CashierName" caption="Cashier Name" />

        <dx-column data-field="ArClientName" caption="ArClient Name" />
        <dx-column data-field="PaymentCode" caption="Payment Code" />
        <dx-column
          data-field="TotalAmount"
          caption="Total Amount"
          alignment="center"
        />
        <dx-column
          data-field="PaymentDate"
          caption="Payment Date"
          alignment="center"
          data-type="date"
        />
        <dx-column
          data-field="PaymentStatus"
          alignment="center"
          caption="Payment Status"
        />
        <dx-column
          data-field="DistributionStatus"
          alignment="center"
          caption="Distribution Status"
        />
        <dx-paging :page-size="10" />
        <dx-pager :show-page-size-selector="true" :show-info="true" />
        <DxSelection
          :select-all-mode="allPages"
          :show-check-boxes-mode="onClick"
          mode="multiple"
        />
        <dx-filter-row :visible="true" />
        <template #cellTemplate="{ data }">
          <div>{{ data.value }}</div>
        </template>
      </dx-data-grid>
    </b-overlay>
  </div>
</template>

<script>
import axios from "axios";

import DxButton from "devextreme-vue/button";

import DxTextBox from "devextreme-vue/text-box";

import DxDataGrid, {
  DxColumn,
  DxFilterRow,
  DxPager,
  DxSelection,
  DxPaging,
} from "devextreme-vue/data-grid";

import DxDateBox from "devextreme-vue/date-box";
import { defaultReq } from "@/utils/request";
import { BRow, BCol, BOverlay } from "bootstrap-vue";
import DxSelectBox from "devextreme-vue/select-box";
import "devextreme/dist/css/dx.light.css";
import moment from "moment";

const columns = [
  "Payer",
  "TotalAmount",
  "PaymentStatus",
  "PaymentDate",
  "CashierName",
  "ArClientName",
  "DistributionStatus",
  "Note",
];
const paymentStatuses = ["NO", "PAY"];
const distributionStatuses = ["NO", "INPROCESS"];

export default {
  data() {
    return {
      dataSource: [],

      loading: false,
      req: {
        DistributionStatus: "",
        PaymentCode: "",
        PaymentStatus: "",

        ...defaultReq,
      },
      paymentStatuses,
      distributionStatuses,
      columns,
    };
  },
  methods: {
    onSelectionChanged(e) {
      console.log(e.selectedRowsData, "1655");
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
    getData(req) {
      this.loading = true;
      axios
        .post("https://pilot.ezgolf.vn/api/AR_RPA01/Process", req, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data.Status === "200") {
            this.dataSource = res.data.Data.ArPayments;
          }
        });
    },
  },
  created() {
    this.getData(this.req);
  },
  components: {
    DxDataGrid,
    DxColumn,

    DxSelectBox,
    DxFilterRow,
    DxDateBox,
    DxButton,
    BRow,
    BCol,
    BOverlay,
    DxPager,
    DxSelection,
    DxPaging,
    DxTextBox,
  },
};
</script>
<style scoped>
.dx-texteditor.dx-editor-filled .dx-placeholder::before,
.dx-texteditor.dx-editor-filled .dx-texteditor-input,
.dx-texteditor.dx-editor-outlined .dx-placeholder::before,
.dx-texteditor.dx-editor-outlined .dx-texteditor-input {
  padding: 0px 14px !important;
}
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
.dx-texteditor-input {
  padding: 0px 14px !important;
}
.row {
  display: flex;
  align-items: center;
}
</style>
