import linsrc from "./search/linsrc.py?raw";
import binsrc from "./search/binsrc.py?raw";

import bubble from "./sort/bubble.py?raw";
import insertion from "./sort/insertion.py?raw";
import merge from "./sort/merge.py?raw";
import quick from "./sort/quick.py?raw";
import selection from "./sort/selection.py?raw";

export const defaultCode: Record<string, Record<string, string>> = {
  search: {
    "linsrc.py": linsrc,
    "binsrc.py": binsrc
  },
  sort: {
    "bubble.py": bubble,
    "insertion.py": insertion,
    "merge.py": merge,
    "quick.py": quick,
    "selection.py": selection
  }
};
