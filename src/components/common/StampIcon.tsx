import { cn } from '@/lib/utils';

interface StampIconProps {
  text?: string;
  size?: number;
  variant?: 'success' | 'warning' | 'danger' | 'info';
  opacity?: number;
  className?: string;
}

const variantColors: Record<string, { stroke: string; fill: string }> = {
  success: { stroke: '#dc2626', fill: '#fef2f2' },
  warning: { stroke: '#d97706', fill: '#fffbeb' },
  danger: { stroke: '#991b1b', fill: '#fef2f2' },
  info: { stroke: '#2563eb', fill: '#eff6ff' },
};

export default function StampIcon({
  text = '核验通过',
  size = 96,
  variant = 'success',
  opacity = 0.9,
  className,
}: StampIconProps) {
  const colors = variantColors[variant];
  const fontSize = Math.floor(size * 0.16);
  const starSize = Math.floor(size * 0.14);
  const center = size / 2;
  const outerRadius = size / 2 - 2;
  const innerRadius = outerRadius - size * 0.08;
  const textRadius = outerRadius - size * 0.12;

  const chars = text.split('');
  const charCount = chars.length;
  const totalAngle = Math.min(charCount * 18, 180);
  const startAngle = 270 - totalAngle / 2;

  return (
    <div
      className={cn('relative inline-block', className)}
      style={{ width: size, height: size, opacity }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <pattern
            id={`stamp-pattern-${variant}`}
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <circle cx="1" cy="1" r="0.4" fill={colors.stroke} opacity="0.3" />
          </pattern>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={Math.max(3, size * 0.04)}
        />
        <circle
          cx={center}
          cy={center}
          r={outerRadius - size * 0.05}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={Math.max(1.5, size * 0.018)}
        />
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill={`url(#stamp-pattern-${variant})`}
          opacity="0.15"
        />

        {chars.map((char, i) => {
          const angle =
            charCount === 1
              ? 270
              : startAngle + (totalAngle / (charCount - 1 || 1)) * i;
          const rad = (angle * Math.PI) / 180;
          const x = center + textRadius * Math.cos(rad);
          const y = center + textRadius * Math.sin(rad);
          const rotate = angle + 90;
          return (
            <text
              key={i}
              x={x}
              y={y}
              fill={colors.stroke}
              fontSize={fontSize}
              fontWeight="bold"
              fontFamily="'SimSun', 'STSong', serif"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${rotate}, ${x}, ${y})`}
            >
              {char}
            </text>
          );
        })}

        <polygon
          points={generateStarPoints(center, center - size * 0.02, starSize, starSize * 0.45, 5)}
          fill={colors.stroke}
        />

        <text
          x={center}
          y={center + size * 0.22}
          fill={colors.stroke}
          fontSize={Math.floor(fontSize * 0.75)}
          fontWeight="bold"
          fontFamily="'SimHei', 'Microsoft YaHei', sans-serif"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          ★
        </text>
      </svg>
    </div>
  );
}

function generateStarPoints(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  points: number,
): string {
  const result: string[] = [];
  const total = points * 2;
  for (let i = 0; i < total; i++) {
    const radius = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    result.push(`${x},${y}`);
  }
  return result.join(' ');
}
