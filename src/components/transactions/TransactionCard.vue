<template>
  <div style="width: 400px; max-width: 80vw">
    <QForm @submit="onSubmit">
      <QCard>
        <QCardSection class="row items-center q-pb-none">
          <div class="text-h6">{{ "transactions.new.title" }}</div>
          <QSpace />
          <QBtn icon="close" flat round dense v-close-popup />
        </QCardSection>
        <QCardSection>
          <QInput
            dense
            square
            filled
            clearable
            v-model="value"
            type="number"
            label="transactions.columns.value"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length) || 'transactions.rules.valueRequired',
            ]"
          />
          <QInput
            dense
            square
            filled
            clearable
            v-model="date"
            label="transactions.columns.date"
            mask="##/##/####"
            :rules="[
              (val) => (val && val.length) || 'transactions.rules.dateRequired',
            ]"
          >
            <template v-slot:prepend>
              <QIcon name="event" class="cursor-pointer">
                <QPopupProxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <QDate
                    ref="dateRef"
                    v-model="date"
                    :mask="DATE_FORMAT"
                    today-btn
                  >
                    <div class="row items-center justify-end">
                      <QBtn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </QDate>
                </QPopupProxy>
              </QIcon>
            </template>
          </QInput>
          <QSelect
            dense
            square
            filled
            clearable
            hide-selected
            fill-input
            use-input
            input-debounce="0"
            emit-value
            map-options
            option-label="name"
            @filter="searchCategoriesAutocomplete"
            @virtual-scroll="searchCategoriesOnScroll"
            v-model="category"
            label="transactions.columns.category"
            :loading="categoriesStore.searching"
            :options="categoriesStore.categories"
            lazy-rules
            error-message="transactions.messages.categoryRequired"
            :error="!category"
          >
            <template v-slot:no-option>
              <QItem>
                <QItemSection class="text-grey"
                  ><QBtn @click="() => (creatingCategory = true)"
                    >Create Category</QBtn
                  ></QItemSection
                >
              </QItem>
            </template>
          </QSelect>
          <QInput
            dense
            square
            filled
            clearable
            v-model="description"
            label="transactions.columns.description"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length) ||
                'transactions.messages.descriptionRequired',
            ]"
          >
          </QInput>
        </QCardSection>

        <QCardActions align="right">
          <QBtn
            color="primary"
            class="col-12"
            type="submit"
            label="transactions.buttons.create"
          />
        </QCardActions>
      </QCard>
    </QForm>
    <QDialog v-model="creatingCategory">
      <CategoryCard />
    </QDialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { Transaction } from "@/interfaces";
import { useTransactionStore } from "@/stores/transaction";
import { useCategoryStore } from "@/stores/categories";
import { Category } from "@/interfaces";
import CategoryCard from "../categories/CategoryCard.vue";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

interface TransactionCardProps {
  transaction?: Transaction;
}
interface TransactionCardEvents {
  (e: "success"): void;
}
const DATE_FORMAT = "DD/MM/YYYY";
const transactionStore = useTransactionStore();
const categoriesStore = useCategoryStore();

const props = defineProps<TransactionCardProps>();
const emit = defineEmits<TransactionCardEvents>();
const date: Ref<string> = ref(dayjs().format(DATE_FORMAT));
const value: Ref<number> = ref(0);
const description: Ref<string | undefined> = ref(undefined);
const category: Ref<Category | undefined> = ref(undefined);
const creatingCategory: Ref<boolean> = ref(false);

if (props.transaction) {
  date.value = props.transaction.date.toDateString();
  value.value = props.transaction.value;
  description.value = props.transaction.description || "";
}

function searchCategoriesAutocomplete(
  val: string,
  update: Function,
  abort: Function
) {
  if (categoriesStore.textFilter === val) {
    update();
    return;
  }

  categoriesStore.textFilter = val;
  categoriesStore.pagination.page = 1;

  update(() => categoriesStore.filterTransactions());
}

function searchCategoriesOnScroll() {
  if (!categoriesStore.searching && !categoriesStore.isLastPage) {
    categoriesStore.filterTransactions();
  }
}

async function onSubmit() {
  try {
    await transactionStore.upsertTransaction({
      ...(props.transaction || {}),
      date: dayjs(date.value, DATE_FORMAT).toDate(),
      value: value.value,
      description: description.value,
      category: category.value!!,
    });
    emit("success");
  } catch (ex) {
    alert(ex);
  }
}
</script>
