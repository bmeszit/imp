<script lang="ts">
  import { t, locale } from 'svelte-i18n';
  import { CodeEditor } from '$lib';
  import { createEditorManager } from '$lib';
  
  import selectionSearchCode from './selection.py?raw';
  import bubbleSearchCode from './bubble.py?raw';
  import insertionSearchCode from './insertion.py?raw';
  import mergeSearchCode from './merge.py?raw';
  import quickSearchCode from './quick.py?raw';

  const editor = createEditorManager("sort-algorithms", {
    "selection.py": selectionSearchCode,
    "bubble.py": bubbleSearchCode,
    "insertion.py": insertionSearchCode,
    "merge.py": mergeSearchCode,
    "quick.py": quickSearchCode,
  });
</script>

<article>
  <header class="page-header">
    <h1>{$t('algos.sort.title')}</h1>
  </header>
  <p>{$t('algos.sort.desc')}</p>
  
  <div class="editor-section">
    <CodeEditor 
      bind:openNames={editor.openNames}
      bind:activeName={editor.activeName} 
      onreset={() => editor.reset()} 
    />
  </div>
</article>