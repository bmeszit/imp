// src/lib/py-runner.svelte.ts
// Svelte 5 runes store for running Python in-browser via Pyodide with time + peak memory (Python allocs).
type PyRunResult = {
  result: string;
  stdout: string;
  stderr: string;
  timeMs: number;
  peakBytes: number;
};

type PyRunnerOptions = {
  indexURL?: string; // e.g. "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
};

export function createPyRunner(options: PyRunnerOptions = {}) {
  const indexURL = options.indexURL ?? "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/";

  let pyodide = $state<any>(null);
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  let last = $state<PyRunResult | null>(null);

  let loadingPromise: Promise<any> | null = null;

  async function ensurePyodide(): Promise<any> {
    if (pyodide) return pyodide;
    if (loadingPromise) return await loadingPromise;

    isLoading = true;
    loadError = null;

    loadingPromise = (async () => {
      try {
        // Prefer installed npm package `pyodide`, otherwise fall back to global `loadPyodide`.
        let loadPyodideFn: any = null;

        try {
          const mod: any = await import("pyodide");
          loadPyodideFn = mod?.loadPyodide ?? null;
        } catch {
          // ignore; try global
        }

        if (!loadPyodideFn) {
          const g: any = globalThis as any;
          loadPyodideFn = g?.loadPyodide ?? null;
        }

        if (!loadPyodideFn) {
          throw new Error(
            "Pyodide loader not found. Install `pyodide` or include a script that defines globalThis.loadPyodide.",
          );
        }

        const inst = await loadPyodideFn({ indexURL });

        // Define a Python helper that executes user code with redirected stdin/stdout/stderr,
        // measures runtime, and records peak allocated memory via tracemalloc.
        inst.runPython(`
import sys, io, traceback, time, tracemalloc

def __run_user_code_with_metrics__(code: str, stdin_text: str | None):
    old_stdin, old_stdout, old_stderr = sys.stdin, sys.stdout, sys.stderr
    sys.stdin = io.StringIO(stdin_text or "")
    out = io.StringIO()
    err = io.StringIO()
    sys.stdout = out
    sys.stderr = err

    glb = {"__name__": "__main__"}
    loc = glb

    tracemalloc.start()
    t0 = time.perf_counter()
    try:
        exec(compile(code, "<user_code>", "exec"), glb, loc)
    except Exception:
        traceback.print_exc()
    t1 = time.perf_counter()
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    sys.stdin, sys.stdout, sys.stderr = old_stdin, old_stdout, old_stderr

    return {
        "stdout": out.getvalue(),
        "stderr": err.getvalue(),
        "time_ms": (t1 - t0) * 1000.0,
        "peak_bytes": int(peak),
    }
        `);

        pyodide = inst;
        return inst;
      } catch (e: any) {
        loadError = String(e?.message ?? e);
        throw e;
      } finally {
        isLoading = false;
      }
    })();

    return await loadingPromise;
  }

  async function run(code: string, inputText?: string): Promise<PyRunResult> {
    const inst = await ensurePyodide();
    const fn = inst.globals.get("__run_user_code_with_metrics__");
    const metrics = fn(code, inputText ?? null);

    const stdout = String(metrics.get("stdout") ?? "");
    const stderr = String(metrics.get("stderr") ?? "");
    const timeMs = Number(metrics.get("time_ms") ?? NaN);
    const peakBytes = Number(metrics.get("peak_bytes") ?? NaN);

    // Best-effort cleanup of PyProxy values.
    try {
      metrics.destroy?.();
    } catch {
      // ignore
    }

    const result = stdout.length > 0 ? stdout : stderr;

    last = { result, stdout, stderr, timeMs, peakBytes };
    return last;
  }

  return {
    // state
    get pyodide() {
      return pyodide;
    },
    get isLoading() {
      return isLoading;
    },
    get loadError() {
      return loadError;
    },
    get last() {
      return last;
    },

    // actions
    ensurePyodide,
    run,
  };
}
