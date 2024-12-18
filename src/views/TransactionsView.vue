<script setup lang="ts">
import { QCard, QDialog, QInnerLoading, QPage, QTable, QTd } from "quasar";
import dayjs from "dayjs";
import { ref } from "vue";
import { useTransactionStore } from "@/stores/transaction";
import TransactionCard from "@/components/transactions/TransactionCard.vue";
import { Category } from "@/interfaces";

const openEdit = ref(false);
const openCreate = ref(false);
const transactionStore = useTransactionStore();

const TRANSACTION_COLUMNS = [
  {
    name: "date",
    field: "date",
    label: "Data",
    sortable: true,
    format: (val: string) => dayjs(val).format("DD/MM/YYYY"),
  },
  {
    name: "category",
    field: "category",
    label: "Categoria",
    format: (val: Category) => val.name,
  },
  {
    name: "description",
    field: "description",
    label: "Descrição",
  },
  {
    name: "value",
    field: "value",
    label: "Valor",
  },
];

transactionStore.filterTransactions();

function confirmRemove() {}
function editTransaction() {}
function addTransaction() {
  openCreate.value = true;
}
function onCreate(){
  openCreate.value = false
  transactionStore.filterTransactions()
}
</script>

<template>
  <QPage class="q-pa-sm">
    <QCard>
      <QCardSection class="q-pa-none">
        <QTable
          :grid="$q.screen.xs"
          :hide-header="$q.screen.xs"
          class="col-12 actions-table"
          title="transactions.title"
          :rows="transactionStore.transactions"
          :columns="TRANSACTION_COLUMNS"
          :loading="transactionStore.searching"
          row-key="name"
          v-model:pagination="transactionStore.pagination"
          @request="transactionStore.filterTransactions"
        >
          <template v-slot:body-cell-id="props">
            <QTd :props="props">
              <QBtn
                icon="edit"
                size="sm"
                flat
                dense
                @click="editTransaction(props.row)"
              />
              <QBtn
                icon="delete"
                size="sm"
                class="q-ml-sm"
                flat
                dense
                color="negative"
                @click="confirmRemove(props.row)"
              />
            </QTd>
          </template>
          <!-- <template v-slot:item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              :style="props.selected ? 'transform: scale(0.95);' : ''"
            >
              <QCard>
                <QCardSection>
                  <div
                    v-for="col in props.cols.filter((col) => col.name !== 'id')"
                    :key="col.name"
                  >
                    <div class="text-h6" v-if="col.name === 'name'">
                      {{ col.value }}
                    </div>
                    <div class="text-subtitle3" v-else>
                      {{ col.label }}: {{ col.value }}
                    </div>
                  </div>
                </QCardSection>
                <QSeparator />
                <QCardActions align="around">
                  <QBtn
                    flat
                    icon="edit"
                    size="sm"
                    dense
                    @click="editUser(props.row)"
                  />
                  <QBtn
                    icon="delete"
                    size="sm"
                    class="q-ml-sm"
                    flat
                    dense
                    color="negative"
                    @click="confirmRemove(props.row)"
                  />
                </QCardActions>
              </QCard>
            </div>
          </template> -->
          <template v-slot:loading>
            <QInnerLoading showing color="primary" />
          </template>
          <template v-slot:top-right>
            <QBtn
              color="primary"
              :disable="transactionStore.searching"
              label="transactions.new.button"
              @click="addTransaction"
            />
          </template>
        </QTable>
      </QCardSection>
    </QCard>
    <QDialog v-model="openEdit">
      <TransactionCard />
    </QDialog>
    <QDialog v-model="openCreate">
      <TransactionCard @success="onCreate"/>
    </QDialog>
  </QPage>
</template>
