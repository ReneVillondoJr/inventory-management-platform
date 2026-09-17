export function Barcode() {
  const widths = [
    2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 3, 2, 1, 1,
    2,
  ];

  let x = 0;

  return (
    <svg
      className='h-7 w-full'
      viewBox='0 0 300 28'
      preserveAspectRatio='none'
      aria-hidden='true'
    >
      {widths.map((width, index) => {
        const isAccent = index % 6 === 0;

        const element = (
          <rect
            key={index}
            x={x}
            y={0}
            width={width}
            height={28}
            fill={isAccent ? '#e2a23c' : '#3a3f43'}
            fillOpacity={isAccent ? 0.9 : 0.55}
          />
        );

        x += width + 2;

        return element;
      })}
    </svg>
  );
}
