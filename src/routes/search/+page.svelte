<script lang="ts">
  import { t, locale } from 'svelte-i18n';
  import { CodeEditor } from '$lib';
  import { createEditorManager } from '$lib';
  
  import binarySearchCode from './binary-search.py?raw';
  import linearSearchCode from './linear-search.py?raw';

  const editor = createEditorManager("search-algorithms", {
    "binary-search.py": binarySearchCode,
    "linear-search.py": linearSearchCode
  });
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
      onreset={() => editor.reset()} 
    />
  </div>
</article>