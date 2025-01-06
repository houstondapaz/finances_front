<template>
  <div style="width: 400px; max-width: 80vw">
    <QForm @submit="onSubmit">
      <QCard>
        <QCardSection class="row items-center q-pb-none">
          <div class="text-h6">Adicionar Gasto</div>
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
            label="Valor"
            lazy-rules
            :rules="[
              (val:number) => (val && !Number.isNaN(val)) || 'Valor é obrigatório',
            ]"
          />
          <QInput
            dense
            square
            filled
            clearable
            v-model="date"
            @focus="() => dateProxyRef?.show()"
            label="Data"
            mask="##/##/####"
            :rules="[(val:string) => (val && val.length > 0) || 'Data é obrigatória']"
          >
            <template v-slot:prepend>
              <QIcon name="event" class="cursor-pointer">
                <QPopupProxy
                  cover
                  ref="dateProxy"
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
            label="Categoria"
            :loading="categoriesStore.searching"
            :options="categoriesStore.categories"
            error-message="Categoria é obrigatória"
            lazy-rules
            :error="!category"
          >
            <template v-slot:no-option>
              <QItem>
                <QItemSection class="text-grey"
                  ><QBtn
                    icon="add"
                    color="primary"
                    @click="() => (creatingCategory = true)"
                    >Criar Categoria</QBtn
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
            label="Descrição"
            lazy-rules
            :rules="[(val:string) => (val && val.length > 0) || 'Descrição é obrigatória']"
          >
          </QInput>
          <QInput
            v-if="!transaction?.id"
            dense
            square
            filled
            clearable
            v-model="installments"
            label="Parcelas"
            type="number"
            lazy-rules
            :rules="[(val:number) => val > 0 || 'Minimo uma parcela']"
          >
          </QInput>
        </QCardSection>

        <QCardActions align="right">
          <QBtn color="primary" class="col-12" type="submit" label="Salvar" />
        </QCardActions>
      </QCard>
    </QForm>
    <QDialog v-model="creatingCategory">
      <CategoryCard @success="onCreateCategory" />
    </QDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import type { Ref } from "vue";
import { Transaction } from "@/interfaces";
import { useTransactionStore } from "@/stores/transaction";
import { useCategoryStore } from "@/stores/categories";
import { Category } from "@/interfaces";
import CategoryCard from "../categories/CategoryCard.vue";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { QInput, QPopupProxy, ValidationRule } from "quasar";
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
const dateProxyRef = useTemplateRef<QPopupProxy>("dateProxy");
const props = defineProps<TransactionCardProps>();
const emit = defineEmits<TransactionCardEvents>();
const date: Ref<string> = ref(dayjs().format(DATE_FORMAT));
const value: Ref<number | null> = ref(null);
const description: Ref<string | undefined> = ref(undefined);
const category: Ref<Category | undefined> = ref(undefined);
const creatingCategory: Ref<boolean> = ref(false);
const installments: Ref<number> = ref(1);

if (props.transaction) {
  date.value =
    typeof props.transaction.date === "string"
      ? dayjs(props.transaction.date).format(DATE_FORMAT)
      : props.transaction.date.toDateString();
  value.value = props.transaction.value;
  description.value = props.transaction.description || "";
  category.value = props.transaction.category;
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

  categoriesStore.filterTransactions().then(() => update());
}

function onCreateCategory() {
  creatingCategory.value = false;
  categoriesStore.filterTransactions();
}

function searchCategoriesOnScroll() {
  if (!categoriesStore.searching && !categoriesStore.isLastPage) {
    categoriesStore.filterTransactions();
  }
}

async function onSubmit() {
  if (props.transaction?.id) {
    await transactionStore.upsertTransaction({
      ...(props.transaction || {}),
      date: dayjs(date.value, DATE_FORMAT).toDate(),
      value: value.value as number,
      description: description.value,
      category: category.value!!,
    });
    emit("success");
    return;
  }

  await transactionStore.upsertTransaction(
    {
      ...(props.transaction || {}),
      date: dayjs(date.value, DATE_FORMAT).toDate(),
      value: value.value as number,
      description: description.value,
      category: category.value!!,
    },
    installments.value
  );
  emit("success");
}
</script>
