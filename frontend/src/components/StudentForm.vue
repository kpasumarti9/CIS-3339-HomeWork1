<script setup>
import { reactive, ref } from 'vue'
const emit = defineEmits(['submit'])
const form = reactive({ name: '', id: '', phone: '', zip: '' })
const validationError = ref('')
function submitForm() { validationError.value = ''; if (Object.values(form).some((value) => !String(value).trim())) { validationError.value = 'Complete every field before adding a student.'; return }; emit('submit', { ...form }) }
function resetForm() { Object.assign(form, { name: '', id: '', phone: '', zip: '' }); validationError.value = '' }
defineExpose({ resetForm })
</script>
<template>
  <form class="form-grid" @submit.prevent="submitForm">
    <div class="field field--wide"><label for="student-name">Full name</label><input id="student-name" v-model="form.name" autocomplete="name" required placeholder="e.g. John Smith" /></div>
    <div class="field"><label for="student-id">Student ID</label><input id="student-id" v-model="form.id" inputmode="numeric" required placeholder="1001" /></div>
    <div class="field"><label for="student-phone">Phone number</label><input id="student-phone" v-model="form.phone" type="tel" autocomplete="tel" required placeholder="555-1234" /></div>
    <div class="field"><label for="student-zip">ZIP code</label><input id="student-zip" v-model="form.zip" inputmode="numeric" autocomplete="postal-code" required placeholder="77001" /></div>
    <p v-if="validationError" class="field-error field--wide" role="alert">{{ validationError }}</p>
    <div class="form-actions field--wide"><button class="button button--primary" type="submit">Add student</button><button class="button button--quiet" type="button" @click="resetForm">Clear</button></div>
  </form>
</template>
