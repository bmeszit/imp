<script lang="ts">
  export let gap = '1.5rem';
</script>

<div class="grid" style="gap: {gap}">
  <slot />
</div>

<style>
  .grid {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: flex-start;
  }
</style>
