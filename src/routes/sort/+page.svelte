<script lang="ts">
  import { t } from 'svelte-i18n';
  import { CodeEditor, createEditorManager } from '$lib';
  import AlgorithmRunner from '$lib/AlgorithmRunner.svelte';
  
  import selectionSearchCode from './selection.py?raw';
  import bubbleSearchCode from './bubble.py?raw';
  import insertionSearchCode from './insertion.py?raw';
  import mergeSearchCode from './merge.py?raw';
  import quickSearchCode from './quick.py?raw';

  // 1. Manager inicializálása az 5 algoritmussal
  const editor = createEditorManager("sort-algorithms", {
    "selection.py": selectionSearchCode,
    "bubble.py": bubbleSearchCode,
    "insertion.py": insertionSearchCode,
    "merge.py": mergeSearchCode,
    "quick.py": quickSearchCode,
  });

  // 2. Méréshez szükséges állapotok
  let testList = $state<number[]>([]);
  let size = $state(200);

  // Generátor függvények
  function generateRandom() {
    testList = Array.from({length: size}, () => Math.floor(Math.random() * size * 10));
  }

  function generateIncreasing() {
    testList = Array.from({length: size}, (_, i) => i + 1);
  }

  function generateDecreasing() {
    testList = Array.from({length: size}, (_, i) => size - i);
  }
</script>

<article>
  <header class="page-header">
    <h1>{$t('algos.sort.title')}</h1>
  </header>
  <p>{$t('algos.sort.desc')}</p>
  
  <div class="editor-section">
    <!-- Megjegyzés: bekerült a bind:allFiles! -->
    <CodeEditor 
      bind:openNames={editor.openNames}
      bind:activeName={editor.activeName} 
      bind:allFiles={editor.allFiles}
      onreset={() => editor.reset()} 
    />
  </div>

  <AlgorithmRunner 
    code={editor.activeCode} 
    inputData={testList}
    pythonCall="rendezes(raw_data.to_py())"
  >
    <div class="controls">
      <div class="input-group">
        <label for="size-input">{$t('algos.common.size') || 'Méret'}:</label>
        <input 
          id="size-input"
          type="number" 
          bind:value={size} 
          min="1" 
          max="2000"
        />
      </div>

      <div class="button-group">
        <button onclick={generateRandom}>{$t('algos.common.random') || 'Véletlen'}</button>
        <button onclick={generateIncreasing}>{$t('algos.common.inc') || 'Növekvő'}</button>
        <button onclick={generateDecreasing}>{$t('algos.common.dec') || 'Csökkenő'}</button>
      </div>

      {#if testList.length > 0}
        <div class="preview">
          {testList.length} elem generálva.
        </div>
      {/if}
    </div>
  </AlgorithmRunner>
</article>

<style lang="scss">
  .editor-section {
    margin-bottom: 20px;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;

    .input-group {
      display: flex;
      align-items: center;
      gap: 8px;
      input {
        width: 80px;
        padding: 4px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    }

    .button-group {
      display: flex;
      gap: 8px;
      button {
        padding: 6px 12px;
        background: #eee;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        &:hover { background: #e0e0e0; }
      }
    }

    .preview {
      font-size: 0.85rem;
      color: #666;
      font-style: italic;
    }
  }
</style>