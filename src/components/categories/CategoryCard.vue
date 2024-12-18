<template>
  <div style="width: 400px; max-width: 80vw">
    <QForm @submit="onSubmit">
      <QCard>
        <QCardSection class="row items-center q-pb-none">
          <div class="text-h6">{{ "categories.new.title" }}</div>
          <QSpace />
          <QBtn icon="close" flat round dense v-close-popup />
        </QCardSection>
        <QCardSection>
          <QInput
            dense
            square
            filled
            clearable
            v-model="name"
            label="categories.columns.name"
            lazy-rules
            :rules="[
              (val) => (val && val.length) || 'categories.rules.nameRequired',
            ]"
          />
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
            option-label="icon"
            v-model="icon"
            label="categories.columns.icon"
            :options="iconsOptions"
            lazy-rules
            error-message="categories.messages.iconRequired"
            :error="true"
          >
            <template v-slot:no-option>
              <QItem>
                <QItemSection class="text-grey"
                  >messages.iconNotFind</QItemSection
                >
              </QItem>
            </template>
          </QSelect>
        </QCardSection>

        <QCardActions align="right">
          <QBtn
            color="primary"
            class="col-12"
            type="submit"
            label="categories.buttons.create"
          />
        </QCardActions>
      </QCard>
    </QForm>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { useCategoryStore } from "@/stores/categories";
import { Category } from "@/interfaces";
import * as Icons from '@quasar/extras/material-icons'

interface CategoryCardProps {
  category?: Category;
}

const categoriesStore = useCategoryStore();

const props = defineProps<CategoryCardProps>();

const name: Ref<string> = ref("");
const icon: Ref<string> = ref("");
if (props.category) {
  name.value = props.category.name;
  icon.value = props.category.icon;
}

const iconsOptions = Object.keys(Icons)

async function onSubmit() {
  try {
    await categoriesStore.upsertCategory({
      ...(props.category || {}),
      name: name.value,
      icon: icon.value,
    });
  } catch (ex) {
    alert(ex);
  }
}
</script>
