<template>
  <div>
    <DxDataGrid :data-source="sales" :show-borders="true" key-expr="orderId">
      <DxColumn :width="90" data-field="orderId" caption="Order ID" />
      <DxColumn data-field="city" />
      <DxColumn :width="180" data-field="country" />
      <DxColumn data-field="region" />
      <DxColumn data-field="date" data-type="date" />
      <DxColumn :width="90" data-field="amount" format="currency" />

      <DxPaging :page-size="10" />
      <DxSelection
        :select-all-mode="allPages"
        :show-check-boxes-mode="onClick"
        mode="multiple"
      />
      <DxFilterRow :visible="true" />
    </DxDataGrid>

   
  </div>
</template>
<script>
/* eslint-disable */
import { DxSelectBox } from "devextreme-vue/select-box";
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxSelection,
  DxFilterRow,
} from "devextreme-vue/data-grid";
import themes from "devextreme/ui/themes";
import { sales } from "@/utils/data-demo";

export default {
  components: {
    DxSelectBox,
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxSelection,
    DxFilterRow,
  },
  data() {
    return {
      allMode: "allPages",
      checkBoxesMode: themes.current().startsWith("material")
        ? "always"
        : "onClick",
      sales,
    };
  },
};
</script>
<style scoped>
.options {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  position: relative;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}

.checkboxes-mode {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.option > .dx-selectbox {
  width: 150px;
  display: inline-block;
  vertical-align: middle;
}

.option > span {
  margin-right: 10px;
}
</style>
