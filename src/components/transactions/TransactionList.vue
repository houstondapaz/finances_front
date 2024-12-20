<template>
  <div>
    <QTable
      class="col-12 actions-table"
      title="Gastos"
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
            @click="tryRemove(props.row)"
          />
        </QTd>
      </template>
      <template v-slot:loading>
        <QInnerLoading showing color="primary" />
      </template>
      <template v-slot:top-right>
        <MonthSelector
          v-model="transactionStore.filterMonth"
          @change="onChangeMonth"
        ></MonthSelector>

        <QBtn
          color="primary"
          :disable="transactionStore.searching"
          icon="add"
          label="Adicionar gasto"
          @click="addTransaction"
        />
      </template>
    </QTable>
    <QDialog v-model="isEditing">
      <TransactionCard @success="onUpdate" :transaction="selectedTransaction" />
    </QDialog>
    <QDialog v-model="isCreating">
      <TransactionCard @success="onCreate" />
    </QDialog>
    <QDialog v-model="isDeleting" persistent>
      <QCard>
        <QCardSection class="row items-center">
          <QAvatar icon="delete_forever" color="primary" text-color="white" />
          <span class="q-ml-sm">Tem certeza que vai remover esse gasto?</span>
        </QCardSection>

        <QCardActions align="right">
          <QBtn flat label="Não" color="primary" v-close-popup />
          <QBtn
            flat
            label="Sim"
            @click="confirmRemove"
            color="primary"
            v-close-popup
          />
        </QCardActions>
      </QCard>
    </QDialog>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { ref } from "vue";
import { QDialog, QInnerLoading, QSelect, QTable, QTd } from "quasar";
import { useTransactionStore } from "@/stores/transaction";
import TransactionCard from "@/components/transactions/TransactionCard.vue";
import MonthSelector from "@/components/shared/MonthSelector.vue";
import { Category, Transaction } from "@/interfaces";

const isEditing = ref<boolean>(false);
const isCreating = ref<boolean>(false);
const isDeleting = ref<boolean>(false);
const selectedTransaction = ref<Transaction | undefined>(undefined);
const transactionStore = useTransactionStore();
const transactionToDelete = ref<Transaction | null>(null);

const TRANSACTION_COLUMNS: {
  name: string;
  field: string;
  label: string;
  sortable: boolean;
  format: (val: unknown) => string;
  align?: "right" | "left" | "center" | undefined;
}[] = [
  {
    name: "date",
    field: "date",
    label: "Data",
    sortable: true,
    format: (val: unknown) => dayjs(val as string).format("DD/MM/YYYY"),
  },
  {
    name: "category",
    field: "category",
    label: "Categoria",
    sortable: false,
    format: (val: unknown) => (val as Category).name,
  },
  {
    name: "description",
    field: "description",
    label: "Descrição",
    sortable: false,
    format: (val: unknown) => val as string,
  },
  {
    name: "value",
    field: "value",
    label: "Valor",
    sortable: false,
    format: (val: unknown) => val as string,
  },
  {
    name: "id",
    label: "",
    field: "id",
    sortable: false,
    align: "right",
    format: (val: unknown) => val as string,
  },
];

transactionStore.filterTransactions();

function onChangeMonth() {
  transactionStore.filterTransactions();
}

function tryRemove(transaction: Transaction) {
  isDeleting.value = true;
  transactionToDelete.value = transaction;
}

function confirmRemove() {
  transactionStore
    .deleteTransaction(transactionToDelete.value!!)
    .then(() => (transactionToDelete.value = null));
}

function editTransaction(transaction: Transaction) {
  selectedTransaction.value = transaction;
  isEditing.value = true;
}

function addTransaction() {
  isCreating.value = true;
}

function onCreate() {
  isCreating.value = false;
  transactionStore.filterTransactions();
}

function onUpdate() {
  isEditing.value = false;
  transactionStore.filterTransactions();
}
</script>
