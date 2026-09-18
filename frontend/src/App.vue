<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink class="brand" to="/students"><span class="brand-mark">CR</span><span>Campus Registry</span></RouterLink>
      <nav aria-label="Primary navigation" class="navigation">
        <RouterLink to="/students">Students</RouterLink>
        <RouterLink to="/courses">Courses</RouterLink>
        <RouterLink to="/enrollments">Enrollments</RouterLink>
      </nav>
    </header>
    <main class="page-wrap"><RouterView /></main>
  </div>
</template>
