<script lang="ts">
  import { t } from 'svelte-i18n';
  import { CodeEditorTabs } from '$lib';
  import { getContext } from "svelte";

  const codeRepo = getContext("codeRepo");

</script>

<article>
  <header class="page-header">
    <h1>{$t('algos.search.title')}</h1>
  </header>
  <p>{$t('algos.search.desc')}</p>
  
  <div class="editor-section">
    <CodeEditorTabs pageId="search" repo={codeRepo} />
  </div>
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