<script lang="ts">
  import AlgorithmGrid from '$lib/AlgorithmGrid.svelte';
  import AlgorithmCard from '$lib/AlgorithmCard.svelte';

  const algorithms = [
    {
      title: 'Binary Search',
      description: 'Efficient search in sorted arrays.'
    },
    {
      title: 'Dijkstra',
      description: 'Shortest path algorithm.'
    },
    {
      title: 'Quick Sort',
      description: 'Divide-and-conquer sorting algorithm.'
    }
  ];
</script>

<AlgorithmGrid gap="2rem">
  {#each algorithms as algo}
    <AlgorithmCard
      title={algo.title}
      description={algo.description}
    />
  {/each}
</AlgorithmGrid>
