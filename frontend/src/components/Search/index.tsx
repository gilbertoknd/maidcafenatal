import styles from "./styles.module.css";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function Search({ value, onChange }: SearchProps) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        placeholder="Buscar delícias..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
