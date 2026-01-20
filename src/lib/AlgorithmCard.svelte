<script lang="ts">
  export let title: string;
  export let description: string;
</script>

<div class="card">
  <h3>{title}</h3>
  <p>{description}</p>

  <slot />
</div>

<style>
  .card {
    background: white;
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    flex: 1 1 260px;
    max-width: 320px;
  }

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    color: #555;
    line-height: 1.4;
  }
</style>
