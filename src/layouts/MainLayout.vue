<template>
  <div class="constrained bg-grey-2">
    <QLayout view="hHR lpr lfr" class="shadow-2 rounded-borders">
      <QHeader bordered class="bg-white text-primary">
        <QToolbar>
          <QToolbarTitle>Gastos Irencio da Paz</QToolbarTitle>
        </QToolbar>
      </QHeader>
      <QPageContainer class="bg-grey-2">
        <router-view />
      </QPageContainer>
    </QLayout>
  </div>
</template>

<script setup lang="ts">
import Menu from "@/components/menu/Menu.vue"
import { ref } from "vue";

const leftDrawerOpen = ref(false);
</script>

<style type="text/css">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300&display=swap");

.constrained {
  width: 100%;
  height: 100%;
}

.constrained .q-layout,
.constrained .q-header,
.constrained .q-footer {
  margin: 0 auto;
  /* max-width: 1245px !important; */
}

.nav-btn {
  min-width: 90px;
}
</style>
