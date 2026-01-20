<script lang="ts">
  import { EditorView, basicSetup } from "codemirror";
  import { python } from "@codemirror/lang-python";
  import { tick } from "svelte";

  let { 
    openNames = $bindable([]), 
    activeName = $bindable(""),
    onreset // New prop for the reset action
  } = $props<{ 
    openNames: string[], 
    activeName: string, 
    onreset: () => void 
  }>();

  let allFiles = $state<Record<string, string>>(
    JSON.parse(localStorage.getItem("global_files_db") || "{}")
  );

  let view: EditorView | null = null;
  let editingName = $state<string | null>(null);

  const activeContent = $derived(activeName ? allFiles[activeName] ?? "" : "");

  $effect(() => {
    localStorage.setItem("global_files_db", JSON.stringify(allFiles));
  });

  function setupEditor(node: HTMLElement) {
    view = new EditorView({
      parent: node,
      doc: activeContent,
      extensions: [
        basicSetup,
        python(),
        EditorView.updateListener.of((u) => {
          if (u.docChanged && activeName) {
            allFiles[activeName] = u.state.doc.toString();
          }
        }),
      ],
    });
    return { destroy: () => view?.destroy() };
  }

  $effect(() => {
    if (view && activeName && view.state.doc.toString() !== activeContent) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: activeContent },
      });
    }
  });

  function add() {
    const newName = `uj_file_${openNames.length + 1}.py`;
    allFiles[newName] = "";
    openNames.push(newName);
    activeName = newName;
  }

  function remove(name: string, e: MouseEvent) {
    e.stopPropagation();
    openNames = openNames.filter(n => n !== name);
    if (activeName === name) activeName = openNames[0] || "";
  }

  async function startEditing(name: string) {
    editingName = name;
    await tick();
    const input = document.querySelector('.tab-input-active') as HTMLInputElement;
    input?.focus();
    input?.select();
  }

  function finishRename(oldName: string, e: Event) {
    const newName = (e.target as HTMLInputElement).value.trim();
    editingName = null;
    
    if (!newName || newName === oldName) return;
    
    allFiles[newName] = allFiles[oldName];
    delete allFiles[oldName];

    const idx = openNames.indexOf(oldName);
    openNames[idx] = newName;
    if (activeName === oldName) activeName = newName;
  }
</script>

<div class="container">
  <nav class="tabs-bar">
    {#each openNames as name (name)}
      <div
        class="tab"
        class:active={activeName === name}
        onclick={() => activeName = name}
        ondblclick={() => startEditing(name)}
        onkeydown={(e) => e.key === 'Enter' && (activeName = name)}
        role="button"
        tabindex="0"
      >
        {#if editingName === name}
          <input 
            class="tab-input-active"
            value={name} 
            onblur={(e) => finishRename(name, e)}
            onkeydown={(e) => e.key === 'Enter' && finishRename(name, e)}
            onclick={e => e.stopPropagation()} 
          />
        {:else}
          <span class="tab-label">{name}</span>
        {/if}
        <button class="close-btn" onclick={(e) => remove(name, e)}>×</button>
      </div>
    {/each}
    <button class="add-btn" onclick={add} title="Új fájl">+</button>

    <!-- Reset button positioned to the far right -->
    <button class="reset-action-btn" onclick={onreset} title="Visszaállítás alaphelyzetbe">
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 4v6h-6"></path>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
      </svg>
    </button>
  </nav>

  <div class="editor-body">
    {#if activeName}
      {#key activeName}
        <div 
          class="cm-wrapper" 
          use:setupEditor 
          onclick={() => view?.focus()}
          onkeydown={(e) => e.key === 'Enter' && view?.focus()}
          role="textbox"
          tabindex="0"
          aria-label="Code Editor"
        ></div>
      {/key}
    {:else}
      <button class="empty" onclick={add} type="button">
        Nincs megnyitott fájl. Kattints a + gombra.
      </button>
    {/if}
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    height: 500px;
    border: 1px solid #ddd;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    font-family: Roboto, sans-serif;

    .tabs-bar {
      display: flex;
      align-items: center;
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
      padding-top: 4px;
      padding-right: 4px; // Spacing for the reset button

      .tab {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px 0 12px;
        background: #eee;
        border: 1px solid #ddd;
        border-bottom: none;
        cursor: pointer;
        width: 150px;
        height: 32px;
        margin-right: 2px;
        border-radius: 6px 6px 0 0;

        &.active {
          background: #fff;
          border-bottom: 2px solid #3776ab;
          z-index: 2;
          .tab-label { font-weight: 600; color: #000; }
        }

        .tab-label {
          flex: 1;
          font-size: 12px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          user-select: none;
        }

        input {
          flex: 1;
          border: 1px solid #3776ab;
          font-size: 12px;
          outline: none;
          width: 0;
        }

        .close-btn {
          border: none;
          background: transparent;
          color: #999;
          font-size: 16px;
          cursor: pointer;
          padding: 2px 6px;
          &:hover { color: #d00; }
        }
      }

      .add-btn {
        background: transparent;
        border: none;
        color: #666;
        font-size: 20px;
        width: 30px;
        height: 30px;
        cursor: pointer;
        &:hover { color: #3776ab; }
      }

      .reset-action-btn {
        margin-left: auto; // Pushes to the right
        background: transparent;
        border: 1px solid transparent;
        color: #888;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;

        &:hover {
          background: #e0e0e0;
          color: #f44336; // Subtle red hint for reset
          border-color: #ccc;
        }

        &:active {
          background: #d0d0d0;
          transform: scale(0.95);
        }
      }
    }

    .editor-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .cm-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        :global(.cm-editor) { flex: 1; outline: none !important; }
        :global(.cm-scroller) { flex: 1; }
      }

      .empty {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #999;
        border: none;
        background: none;
        cursor: pointer;
      }
    }
  }
</style>