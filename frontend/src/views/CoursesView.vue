<script setup>
import { onMounted, ref } from 'vue'
import NoticeMessage from '../components/NoticeMessage.vue'
import { request } from '../api'
const courses = ref([]); const form = ref({ id: '', name: '' }); const loading = ref(false); const error = ref(''); const message = ref('')
async function loadCourses() { loading.value = true; error.value = ''; try { courses.value = await request('/courses') } catch (requestError) { error.value = requestError.message } finally { loading.value = false } }
async function addCourse() { error.value = ''; message.value = ''; if (!form.value.id.trim() || !form.value.name.trim()) { error.value = 'Course ID and course name are required.'; return }; try { const result = await request('/courses', { method: 'POST', body: JSON.stringify(form.value) }); message.value = result.message || 'Course added successfully.'; form.value = { id: '', name: '' }; await loadCourses() } catch (requestError) { error.value = requestError.message } }
async function deleteCourse(course) { if (!window.confirm(`Delete ${course.name}?`)) return; try { await request(`/courses/${encodeURIComponent(course.id)}`, { method: 'DELETE' }); message.value = 'Course deleted successfully.'; await loadCourses() } catch (requestError) { error.value = requestError.message } }
onMounted(loadCourses)
</script>
<template>
  <section class="page-heading"><div><p class="eyebrow">Catalog</p><h1>Courses</h1><p class="lede">Maintain the courses available for enrollment.</p></div></section>
  <div class="content-grid"><section class="panel"><p class="eyebrow">New record</p><h2>Add a course</h2><form class="stack-form" @submit.prevent="addCourse"><div class="field"><label for="course-id">Course ID</label><input id="course-id" v-model="form.id" required placeholder="CIS 3339" /></div><div class="field"><label for="course-name">Course name</label><input id="course-name" v-model="form.name" required placeholder="Enterprise Applications Development" /></div><button class="button button--primary" type="submit" :disabled="loading">Add course</button></form></section>
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">Catalog</p><h2>All courses</h2></div><span class="count-badge">{{ courses.length }}</span></div><NoticeMessage kind="error" :text="error" /><NoticeMessage kind="success" :text="message" /><p v-if="loading" class="empty-state">Loading courses...</p><p v-else-if="!courses.length" class="empty-state">No courses have been added yet.</p><ul v-else class="record-list"><li v-for="course in courses" :key="course.id"><div><strong>{{ course.id }}</strong><span>{{ course.name }}</span></div><button class="button button--danger" type="button" @click="deleteCourse(course)">Delete</button></li></ul></section>
  </div>
</template>
