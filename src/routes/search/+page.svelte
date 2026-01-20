<script lang="ts">
  import { t } from 'svelte-i18n';
  import { CodeEditor, createEditorManager } from '$lib';
  import AlgorithmRunner from '$lib/AlgorithmRunner.svelte';
  
  import binarySearchCode from './binary-search.py?raw';
  import linearSearchCode from './linear-search.py?raw';

  const editor = createEditorManager("search-algorithms", {
    "binary-search.py": binarySearchCode,
    "linear-search.py": linearSearchCode
  });

  // Állapotok a generáláshoz
  let testList = $state<number[]>([]);
  let target = $state<number>(0);
  let size = $state(1000);

  // Generátor: Mindig növekvő listát gyártunk (bináris keresés miatt)
  function generateSortedData() {
    // Páros számok listája: 0, 2, 4, 6, ...
    testList = Array.from({length: size}, (_, i) => i * 2);
  }

  // Gyors gombok a célpont beállításához
  function setTarget(type: 'start' | 'end' | 'middle' | 'missing') {
    if (testList.length === 0) generateSortedData();
    
    if (type === 'start') target = testList[0];
    if (type === 'end') target = testList[testList.length - 1];
    if (type === 'middle') target = testList[Math.floor(testList.length / 2)];
    if (type === 'missing') target = testList[testList.length - 1] + 1; // Egy páratlan szám biztos hiányzik
  }
</script>

<article>
  <header class="page-header">
    <h1>{$t('algos.search.title')}</h1>
  </header>
  <p>{$t('algos.search.desc')}</p>
  
  <div class="editor-section">
    <CodeEditor 
      bind:openNames={editor.openNames}
      bind:activeName={editor.activeName} 
      bind:allFiles={editor.allFiles}
      onreset={() => editor.reset()} 
    />
  </div>

  <AlgorithmRunner 
    code={editor.activeCode} 
    inputData={{ list: testList, target: target }}
    pythonCall="kereses(raw_data.list.to_py(), raw_data.target)"
  >
    <div class="search-controls">
      <div class="config-row">
        <label>
          {$t('algos.common.size') || 'Lista mérete'}:
          <input type="number" bind:value={size} onchange={generateSortedData} />
        </label>
        
        <label>
          {$t('algos.common.target') || 'Keresett érték'}:
          <input type="number" bind:value={target} />
        </label>
      </div>

      <div class="preset-row">
        <span>Beállítás:</span>
        <button onclick={() => setTarget('start')}>Lista eleje</button>
        <button onclick={() => setTarget('middle')}>Lista közepe</button>
        <button onclick={() => setTarget('end')}>Lista vége</button>
        <button onclick={() => setTarget('missing')}>Nincs a listában</button>
      </div>

      {#if testList.length > 0}
        <div class="info">
          Tartomány: {testList[0]} - {testList[testList.length - 1]} (Csak páros számok)
        </div>
      {/if}
    </div>
  </AlgorithmRunner>
</article>

<style lang="scss">
  .editor-section {
    margin-bottom: 20px;
  }

  .search-controls {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .config-row {
      display: flex;
      gap: 20px;
      align-items: center;

      input {
        padding: 4px 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100px;
      }
    }

    .preset-row {
      display: flex;
      gap: 8px;
      align-items: center;
      span { font-size: 0.9rem; font-weight: bold; }
      
      button {
        padding: 4px 10px;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        &:hover { background: #e0e0e0; }
      }
    }

    .info {
      font-size: 0.8rem;
      color: #666;
      background: #eee;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
    }
  }
</style>