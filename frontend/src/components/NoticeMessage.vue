<script setup>
defineProps({ kind: { type: String, default: 'info' }, text: { type: String, default: '' } })
</script>
<template><p v-if="text" class="notice" :class="`notice--${kind}`" role="status">{{ text }}</p></template>
