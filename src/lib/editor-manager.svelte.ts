// src/lib/editor-manager.svelte.ts
export function createEditorManager(pageId: string, defaultFiles: Record<string, string>) {
    
    // 1. Tab nevek (ez marad)
    let openNames = $state<string[]>(
        JSON.parse(localStorage.getItem(`tabs_${pageId}`) || "[]")
    );
    
    let activeName = $state<string>(
        localStorage.getItem(`active_tab_${pageId}`) || ""
    );

    // 2. ÚJ: A fájlok tartalma ide költözik a CodeEditorból!
    let allFiles = $state<Record<string, string>>(
        JSON.parse(localStorage.getItem("global_files_db") || "{}")
    );

    // 3. Mentések (ezek maradnak + az új allFiles mentése)
    $effect(() => {
        localStorage.setItem(`tabs_${pageId}`, JSON.stringify(openNames));
    });

    $effect(() => {
        localStorage.setItem(`active_tab_${pageId}`, activeName);
    });

    // ÚJ: ha a fájlok változnak, mentjük a globális adatbázisba
    $effect(() => {
        localStorage.setItem("global_files_db", JSON.stringify(allFiles));
    });

    // 4. ÚJ: Ez a legfontosabb sor a méréshez!
    // Ez egy reaktív változó, ami mindig az aktuális fájl kódját adja vissza.
    const activeCode = $derived(allFiles[activeName] || "");

    function init() {
        const db = JSON.parse(localStorage.getItem("global_files_db") || "{}");
        let changed = false;

        if (openNames.length === 0) {
            openNames = Object.keys(defaultFiles);
            activeName = openNames[0] || "";
            
            for (const [name, content] of Object.entries(defaultFiles)) {
                if (!db[name]) {
                    db[name] = content;
                    changed = true;
                }
            }
        }

        if (changed) {
            // Frissítjük a lokális állapunkat is az inicializáláskor
            allFiles = db;
            localStorage.setItem("global_files_db", JSON.stringify(db));
        }
        
        if (!activeName && openNames.length > 0) {
            activeName = openNames[0];
        }
    }

    function reset() {
        const db = JSON.parse(localStorage.getItem("global_files_db") || "{}");
        openNames.forEach(name => delete db[name]);
        for (const [name, content] of Object.entries(defaultFiles)) {
            db[name] = content;
        }
        localStorage.setItem("global_files_db", JSON.stringify(db));
        
        openNames = Object.keys(defaultFiles);
        activeName = openNames[0] || "";

        window.location.reload();
    }

    init();

    return {
        // Tabok kezelése
        get openNames() { return openNames; },
        set openNames(val) { openNames = val; },
        get activeName() { return activeName; },
        set activeName(val) { activeName = val; },
        
        // Fájlok tartalma (kell a CodeEditornak)
        get allFiles() { return allFiles; },
        set allFiles(val) { allFiles = val; },

        // A méréshez szükséges aktuális kód
        get activeCode() { return activeCode; },
        
        reset
    };
}