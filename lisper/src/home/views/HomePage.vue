<template>
    <div class="home-page">
        <manual />
    </div>
</template>

<script>
import Manual from './manual.md'
export default {
    components: {
        Manual
    }
}
</script>

<style lang="scss" scoped>
.home-page {
    padding: 36px;
}
</style>