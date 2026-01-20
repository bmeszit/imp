<script lang="ts">
  import { EditorView, basicSetup } from "codemirror";
  import { python } from "@codemirror/lang-python";
  import { onMount } from "svelte";

  interface File { id: string; name: string; content: string; }

  let files = $state<File[]>(JSON.parse(localStorage.getItem('py-editor') || '[]'));
  let activeId = $state<string | null>(files[0]?.id || null);
  let view: EditorView | null = null;

  const activeFile = $derived(files.find(f => f.id === activeId));

  $effect(() => { localStorage.setItem('py-editor', JSON.stringify(files)); });

  function setupEditor(node: HTMLElement) {
    view = new EditorView({
      parent: node,
      doc: activeFile?.content || "",
      extensions: [
        basicSetup, 
        python(),
        EditorView.updateListener.of(u => { 
          if (u.docChanged && activeFile) activeFile.content = u.state.doc.toString(); 
        })
      ],
    });
    return { destroy: () => view?.destroy() };
  }

  $effect(() => {
    if (view && activeFile && view.state.doc.toString() !== activeFile.content) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: activeFile.content } });
    }
  });

  function add() {
    const newFile = { id: crypto.randomUUID(), name: 'uj.py', content: '' };
    files.push(newFile);
    activeId = newFile.id;
  }

  function remove(id: string, e: MouseEvent) {
    e.stopPropagation();
    files = files.filter(f => f.id !== id);
    if (activeId === id) activeId = files[0]?.id || null;
  }

  onMount(() => { if (files.length === 0) add(); });
</script>

<div class="container">
  <div class="tabs">
    {#each files as file (file.id)}
      <div class="tab" class:active={activeId === file.id} onclick={() => activeId = file.id}>
        <input bind:value={file.name} />
        <button onclick={(e) => remove(file.id, e)}>×</button>
      </div>
    {/each}
    <button onclick={add}>+ Új</button>
  </div>

  <div class="editor">
    {#if activeId}
      <div use:setupEditor></div>
    {:else}
      <p>Nincs fájl</p>
    {/if}
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    height: 500px;
    border: 1px solid #000;

    .tabs {
      display: flex;
      gap: 5px;
      padding: 5px;
      background: #eee;
      border-bottom: 1px solid #000;

      .tab {
        display: flex;
        border: 1px solid #000;
        padding: 2px 5px;
        background: #fff;
        cursor: pointer;

        &.active { background: #000; color: #fff; input { color: #fff; } }
        
        input { border: none; background: transparent; width: 80px; outline: none; }
        button { border: none; background: transparent; cursor: pointer; color: inherit; }
      }
    }

    .editor {
      flex: 1;
      overflow: hidden;
      :global(.cm-editor) { height: 100%; }
    }
  }
</style>