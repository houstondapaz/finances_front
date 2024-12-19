<template>
  <div style="width: 400px; max-width: 80vw">
    <QForm @submit="onSubmit">
      <QCard>
        <QCardSection class="row items-center q-pb-none">
          <div class="text-h6">Criar Categoria</div>
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
            label="Nome"
            lazy-rules
            :rules="[(val) => (val && val.length) || 'Nome é obrigatório']"
          />
          <!-- <QSelect
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
            label="Ícone"
            :options="iconsOptions"
            lazy-rules
            error-message="Ícone é obrigatório"
            :error="true"
          >
            <template v-slot:no-option>
              <QItem>
                <QItemSection class="text-grey"
                  >Ícone não encontrado</QItemSection
                >
              </QItem>
            </template>

            <template v-slot:option="scope">
              <QItem><QIcon size="sm" :name="scope.opt"></QIcon></QItem>
            </template>
          </QSelect> -->
        </QCardSection>

        <QCardActions align="right">
          <QBtn
            color="primary"
            class="col-12"
            type="submit"
            label="Adicionar"
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
import * as Icons from "@quasar/extras/material-icons";

interface CategoryCardProps {
  category?: Category;
  name?: string;
}
interface CategoryCardEvents {
  (e: "success"): void;
}

const categoriesStore = useCategoryStore();

const props = defineProps<CategoryCardProps>();
const emit = defineEmits<CategoryCardEvents>();

const name: Ref<string> = ref(props.name || "");
const icon: Ref<string> = ref("");
if (props.category) {
  name.value = props.category.name;
  icon.value = props.category.icon;
}
const iconsOptions = Object.keys(Icons).map((i) =>
  i.replace("mat", "").toLowerCase()
);

async function onSubmit() {
  try {
    await categoriesStore.upsertCategory({
      ...(props.category || {}),
      name: name.value,
      icon: icon.value,
    });
    emit("success");
  } catch (ex) {
    alert(ex);
  }
}
</script>
