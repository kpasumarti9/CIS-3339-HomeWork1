import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../api'

export const useStudentStore = defineStore('students', () => {
  const currentStudent = ref(null)
  const loading = ref(false)
  const error = ref('')
  const message = ref('')
  const hasResult = computed(() => currentStudent.value !== null)
  function clearFeedback() { error.value = ''; message.value = '' }
  async function searchStudent(name) { clearFeedback(); loading.value = true; try { currentStudent.value = await request('/find-student', { method: 'POST', body: JSON.stringify({ name: name.trim() }) }) } catch (requestError) { currentStudent.value = null; error.value = requestError.message } finally { loading.value = false } }
  async function addStudent(student) { clearFeedback(); loading.value = true; try { const result = await request('/add-student', { method: 'POST', body: JSON.stringify(student) }); message.value = result.message || 'Student added successfully.' } catch (requestError) { error.value = requestError.message } finally { loading.value = false } }
  async function deleteStudent(name) { clearFeedback(); loading.value = true; try { const result = await request('/delete-student', { method: 'POST', body: JSON.stringify({ name }) }); currentStudent.value = null; message.value = result.message || 'Student deleted successfully.' } catch (requestError) { error.value = requestError.message } finally { loading.value = false } }
  return { currentStudent, loading, error, message, hasResult, searchStudent, addStudent, deleteStudent, clearFeedback }
})
