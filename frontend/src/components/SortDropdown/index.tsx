import { useEffect, useRef, useState } from "react";
import { ArrowDownUp, ChevronDown, Check } from "lucide-react";
import styles from "./styles.module.css";
import { SORT_OPTIONS, type SortKey } from "../../utils/ordenarProdutos";

interface SortDropdownProps {
  value: SortKey;
  onChange: (key: SortKey) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selecionada =
    SORT_OPTIONS.find((o) => o.key === value) ?? SORT_OPTIONS[0];

  // Fecha ao clicar fora ou pressionar Esc.
  useEffect(() => {
    if (!open) return;

    const handleClickFora = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickFora);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const handleSelect = (key: SortKey) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Ordenar por"
      >
        <ArrowDownUp size={16} className={styles.triggerIcon} />
        <span className={styles.triggerLabel}>{selecionada.label}</span>
        <ChevronDown
          size={16}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      {open && (
        <ul className={styles.menu} role="listbox" aria-label="Ordenar por">
          {SORT_OPTIONS.map((opcao) => {
            const ativa = opcao.key === value;
            return (
              <li key={opcao.key} role="option" aria-selected={ativa}>
                <button
                  type="button"
                  className={`${styles.option} ${ativa ? styles.optionActive : ""}`}
                  onClick={() => handleSelect(opcao.key)}
                >
                  <span>{opcao.label}</span>
                  {ativa && <Check size={16} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
