<script setup lang="ts">
import { QCard, QPage } from "quasar";
import TransactionList from "@/components/transactions/TransactionList.vue"
import Exepenses from "@/components/expenses/Exepenses.vue";
</script>

<template>
  <QPage class="q-pa-sm">
    <QCard>
      <QCardSection>
        <Exepenses />
      </QCardSection>
      <QCardSection class="q-pa-none">
        <TransactionList></TransactionList>
      </QCardSection>
    </QCard>
  </QPage>
</template>
