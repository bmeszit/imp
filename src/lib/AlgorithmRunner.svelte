<script lang="ts">
  import { usePyodide } from './pyodide.svelte';
  
  // Props: 
  // - code: az editor.activeCode (ezt kapja meg)
  // - inputData: a generált adat (pl. a lista)
  // - pythonCall: a szöveg, ahogy hívjuk a függvényt (pl. "rendezes(raw_data.to_py())")
  // - children: a generáló gombok helye
  let { code, inputData, pythonCall, children } = $props();

  const py = usePyodide();
  let time = $state<number | null>(null);
  let isExecuting = $state(false);

  async function run() {
    isExecuting = true;
    try {
      const instance = await py.init();
      
      // Adat átadása JS -> Python
      instance.globals.set('raw_data', inputData);
      
      const t0 = performance.now();
      // A szerkesztett kód + a hívás lefuttatása
      await instance.runPythonAsync(`
${code}
${pythonCall}
      `);
      const t1 = performance.now();
      
      time = t1 - t0;
    } catch (e: any) {
      alert("Python hiba: " + e.message);
    } finally {
      isExecuting = false;
    }
  }
</script>

<div class="runner-container">
  <div class="generator-slot">
    {@render children()}
  </div>

  <div class="action-bar">
    <button class="run-btn" onclick={run} disabled={isExecuting}>
      {#if isExecuting} 
        Homokóra... 
      {:else if py.loading}
        Python betöltése...
      {:else}
        Futtatás és mérés
      {/if}
    </button>

    {#if time !== null}
      <div class="result">
        Utolsó futás: <strong>{time.toFixed(4)} ms</strong>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .runner-container {
    margin-top: 1rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;

    .generator-slot {
      margin-bottom: 1rem;
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .action-bar {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .run-btn {
      background: #3776ab;
      color: white;
      border: none;
      padding: 8px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      &:disabled { background: #6c757d; }
      &:hover:not(:disabled) { background: #2b5b87; }
    }

    .result {
      font-family: monospace;
      font-size: 1.1rem;
    }
  }
</style>