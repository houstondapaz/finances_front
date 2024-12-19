<template>
  <QCard>
    <QCardSection>
      <QLinearProgress
        size="30px"
        :color="budgetStore.percentColor"
        rounded
        :value="budgetStore.monthSpentPercent"
      >
        <div class="absolute-full flex flex-center">
          <QBadge
            size="lg"
            color="white"
            text-color="primary"
            :label="monthSpentPercentLabel"
          />
        </div>
      </QLinearProgress>
    </QCardSection>
    <QCardSection>
      <QChip size="lg" dense outline
        >Orçamento mensal R$ {{ budgetStore.budget }}</QChip
      >
      <QChip size="lg" dense outline :color="budgetStore.percentColor"
        >Orçamento diário R$ {{ budgetStore.dailyBudget?.toFixed(2) }}</QChip
      >
    </QCardSection>
  </QCard>
</template>
<script lang="ts" setup>
import { useBudgetStore } from "@/stores/budget";
import { computed } from "vue";

const budgetStore = useBudgetStore();

budgetStore.getBudget();

const monthSpentPercentLabel = computed(
  () =>
    `${(budgetStore.monthSpentPercent * 100).toFixed(
      2
    )}% (R$ ${budgetStore.spent.toFixed(2)})`
);
</script>
