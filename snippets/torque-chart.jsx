export const TorqueChart = ({ data, mapId }) => {
  const width = 600;
  const height = 320;
  const margin = { top: 20, right: 30, bottom: 50, left: 55 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const maxRpm = Math.max(...data.map(d => d.rpm));
  const maxTorque = Math.max(...data.map(d => d.torque));
  const minTorque = 0;
  const torqueRange = maxTorque * 1.2;

  const xScale = rpm => (rpm / maxRpm) * innerWidth;
  const yScale = torque => innerHeight - ((torque - minTorque) / torqueRange) * innerHeight;

  // Build smooth polyline points
  const points = data.map(d => `${xScale(d.rpm)},${yScale(d.torque)}`).join(" ");

  // X axis ticks
  const xTicks = [];
  const xStep = maxRpm / 10;
  for (let i = 0; i <= 10; i++) {
    xTicks.push(i * xStep);
  }

  // Y axis ticks
  const yTicks = [];
  const yStep = (torqueRange) / 6;
  for (let i = 0; i <= 6; i++) {
    const val = i * yStep;
    yTicks.push(Math.round(val * 10) / 10);
  }

  const [hovered, setHovered] = useState(null);

  return (
    <div className="not-prose rounded-xl border border-zinc-950/10 dark:border-white/10 p-4 bg-zinc-950/5 dark:bg-white/5">
      {mapId && (
        <p className="text-xs font-mono text-zinc-950/40 dark:text-white/40 mb-3">
          {mapId}
        </p>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto" }}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>

          {/* Grid lines */}
          {xTicks.map(tick => (
            <line
              key={`xgrid-${tick}`}
              x1={xScale(tick)} y1={0}
              x2={xScale(tick)} y2={innerHeight}
              stroke="#ffffff10"
              strokeWidth={1}
            />
          ))}
          {yTicks.map(tick => (
            <line
              key={`ygrid-${tick}`}
              x1={0} y1={yScale(tick)}
              x2={innerWidth} y2={yScale(tick)}
              stroke="#ffffff10"
              strokeWidth={1}
            />
          ))}

          {/* Area fill */}
          <polyline
            points={`${xScale(data[0].rpm)},${innerHeight} ${points} ${xScale(data[data.length - 1].rpm)},${innerHeight}`}
            fill="#00FF40"
            fillOpacity={0.08}
            stroke="none"
          />

          {/* Torque line */}
          <polyline
            points={points}
            fill="none"
            stroke="#00FF40"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(d.rpm)}
              cy={yScale(d.torque)}
              r={hovered === i ? 7 : 5}
              fill="#00FF40"
              stroke="#00FF40"
              strokeWidth={2}
              fillOpacity={hovered === i ? 1 : 0.8}
              style={{ cursor: "pointer", transition: "r 0.1s" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}

          {/* Tooltip */}
          {hovered !== null && (() => {
            const d = data[hovered];
            const cx = xScale(d.rpm);
            const cy = yScale(d.torque);
            const boxW = 110;
            const boxH = 40;
            const bx = Math.min(cx - boxW / 2, innerWidth - boxW);
            const by = cy - boxH - 12;
            return (
              <g>
                <rect
                  x={bx} y={by}
                  width={boxW} height={boxH}
                  rx={6} ry={6}
                  fill="#1a1a1a"
                  stroke="#00FF40"
                  strokeWidth={1}
                  strokeOpacity={0.4}
                />
                <text
                  x={bx + boxW / 2} y={by + 14}
                  textAnchor="middle"
                  fill="#00FF40"
                  fontSize={12}
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {d.torque} Nm
                </text>
                <text
                  x={bx + boxW / 2} y={by + 30}
                  textAnchor="middle"
                  fill="#888"
                  fontSize={11}
                  fontFamily="monospace"
                >
                  {d.rpm} RPM
                </text>
              </g>
            );
          })()}

          {/* X axis */}
          <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#444" strokeWidth={1} />
          {xTicks.map(tick => (
            <g key={`xtick-${tick}`}>
              <line x1={xScale(tick)} y1={innerHeight} x2={xScale(tick)} y2={innerHeight + 5} stroke="#444" strokeWidth={1} />
              <text
                x={xScale(tick)} y={innerHeight + 18}
                textAnchor="middle"
                fill="#888"
                fontSize={11}
                fontFamily="monospace"
              >
                {tick === 0 ? "0" : tick >= 1000 ? `${tick / 1000}k` : tick}
              </text>
            </g>
          ))}

          {/* Y axis */}
          <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#444" strokeWidth={1} />
          {yTicks.map(tick => (
            <g key={`ytick-${tick}`}>
              <line x1={-5} y1={yScale(tick)} x2={0} y2={yScale(tick)} stroke="#444" strokeWidth={1} />
              <text
                x={-10} y={yScale(tick) + 4}
                textAnchor="end"
                fill="#888"
                fontSize={11}
                fontFamily="monospace"
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text
            x={innerWidth / 2} y={innerHeight + 44}
            textAnchor="middle"
            fill="#666"
            fontSize={12}
            fontFamily="monospace"
          >
            RPM
          </text>
          <text
            x={-innerHeight / 2} y={-42}
            textAnchor="middle"
            fill="#666"
            fontSize={12}
            fontFamily="monospace"
            transform="rotate(-90)"
          >
            Torque [Nm]
          </text>

        </g>
      </svg>
    </div>
  );
};
