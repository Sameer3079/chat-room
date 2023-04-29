import { CSSProperties } from 'react';

export default function Button(props: {
  name: string;
  styles?: CSSProperties | undefined;
}) {
  return (
    <button
      style={{
        backgroundColor: '#0369a1',
        color: 'white',
        borderRadius: '0.25rem',
        padding: '0.25rem 0.5rem',
        border: 'none',
        ...props.styles,
      }}
    >
      {props.name}
    </button>
  );
}
