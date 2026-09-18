<script setup>
import { ref } from 'vue'
import NoticeMessage from '../components/NoticeMessage.vue'
import StudentForm from '../components/StudentForm.vue'
import { useStudentStore } from '../stores/students'
const store = useStudentStore(); const searchName = ref(''); const formRef = ref(null)
async function search() { if (!searchName.value.trim()) { store.error = 'Enter a student name to search.'; return }; await store.searchStudent(searchName.value) }
async function addStudent(student) { await store.addStudent(student); if (!store.error) formRef.value?.resetForm() }
async function removeStudent() { if (window.confirm(`Delete ${store.currentStudent.name}?`)) await store.deleteStudent(store.currentStudent.name) }
</script>
<template>
  <section class="page-heading"><div><p class="eyebrow">Directory</p><h1>Students</h1><p class="lede">Find a student or add a new record to the campus directory.</p></div></section>
  <div class="content-grid">
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">New record</p><h2>Add a student</h2></div></div><StudentForm ref="formRef" @submit="addStudent" /></section>
    <section class="panel panel--accent"><div class="panel-heading"><div><p class="eyebrow">Lookup</p><h2>Search the directory</h2></div></div>
      <form class="search-row" @submit.prevent="search"><label class="sr-only" for="search-name">Student name</label><input id="search-name" v-model="searchName" placeholder="Search by exact name" required /><button class="button button--dark" type="submit" :disabled="store.loading">{{ store.loading ? 'Searching...' : 'Search' }}</button></form>
      <NoticeMessage kind="error" :text="store.error" /><NoticeMessage kind="success" :text="store.message" />
      <div v-if="store.currentStudent" class="result-card"><div class="result-card__topline"><div><p class="eyebrow">Student record</p><h3>{{ store.currentStudent.name }}</h3></div><button class="button button--danger" type="button" :disabled="store.loading" @click="removeStudent">Delete</button></div><dl class="details-list"><div><dt>Student ID</dt><dd>{{ store.currentStudent.id }}</dd></div><div><dt>Phone</dt><dd>{{ store.currentStudent.phone }}</dd></div><div><dt>ZIP code</dt><dd>{{ store.currentStudent.zip }}</dd></div></dl></div>
      <p v-else class="empty-state">Search results will appear here.</p>
    </section>
  </div>
</template>
