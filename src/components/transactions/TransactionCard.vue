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
              '##/##/####',
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
                  <QDate v-model="date" mask="DD/MM/YYYY" today-btn>
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
            @virtual-scroll="searchIntegrationsOnScroll"
            v-model="category"
            :label="$t('environments.columns.integration')"
            :loading="searchIntegrations.loading"
            :options="integrations"
            lazy-rules
            :error-message="$t('environments.messages.integrationRequired')"
            :error="integrationRequired"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">{{
                  $t("messages.integrationsNoResults")
                }}</q-item-section>
              </q-item>
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
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { Transaction } from "@/interfaces";
import { useTransactionStore } from "@/stores/transaction";

interface TransactionCardProps {
  transaction?: Transaction;
}
const transactionStore = useTransactionStore();

const props = defineProps<TransactionCardProps>();

const date: Ref<Date> = ref(null);
const value: Ref<number> = ref(0);
const description: Ref<string> = ref(null);

if (props.transaction) {
  date.value = props.transaction.date;
  value.value = props.transaction.value;
  description.value = props.transaction.description;
}

async function onSubmit() {
  try {
    console.log("date", date, "value", value, "description", description);
    await transactionStore.upsertTransaction({
      ...(props.transaction || {}),
      date: date.value,
      value: value.value,
      description: description.value,
    });
  } catch (ex) {
    alert(ex);
  }
}
</script>
