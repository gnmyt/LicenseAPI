<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>

  <img src="/licenseapi-dark.png" v-if="colorMode.value === 'light'" alt="LicenseAPI Logo" />
  <img src="/licenseapi.png" v-else alt="LicenseAPI Logo" />
</template>