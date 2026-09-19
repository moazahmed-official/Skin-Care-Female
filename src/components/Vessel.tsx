import type { Vessel as VesselData } from "@/data/types";

/**
 * Procedural product artwork. Every bottle on the site is drawn from the
 * product's `vessel` record — no photography, no bitmap assets.
 *
 * The drawing is built in a 200 x 300 viewBox with the vessel standing on
 * y = 282 so that different silhouettes share a shelf line when placed
 * side by side.
 */

const BASE = 282;

function Glass({ id, tint }: { id: string; tint: string }) {
  return (
    <>
      {/* vertical glass falloff: lit left edge, shadowed right */}
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={tint} stopOpacity="0.95" />
        <stop offset="22%" stopColor="#ffffff" stopOpacity="0.34" />
        <stop offset="46%" stopColor={tint} stopOpacity="0.92" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
      </linearGradient>
      {/* specular highlight strip */}
      <linearGradient id={`${id}-spec`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.62" />
        <stop offset="60%" stopColor="#ffffff" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </>
  );
}

function Shadow({ id, width }: { id: string; width: number }) {
  return (
    <ellipse
      cx="100"
      cy={BASE + 5}
      rx={width * 0.62}
      ry="7"
      fill={`url(#${id}-shade)`}
    />
  );
}

export interface VesselProps extends React.SVGProps<SVGSVGElement> {
  vessel: VesselData;
  /** Unique per instance — prevents gradient id collisions on a grid. */
  uid: string;
  /** Short product mark printed on the label. */
  mark?: string;
}

export function Vessel({ vessel, uid, mark, className, ...rest }: VesselProps) {
  const { kind, glass, fill, scale } = vessel;
  const id = `v-${uid}`;

  return (
    <svg
      viewBox="0 0 200 300"
      role="presentation"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <defs>
        <Glass id={id} tint={glass} />
        <radialGradient id={`${id}-shade`}>
          <stop offset="0%" stopColor="#0e1d24" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#0e1d24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={fill} stopOpacity="0.72" />
        </linearGradient>
      </defs>

      <g transform={`translate(100 ${BASE}) scale(${scale}) translate(-100 ${-BASE})`}>
        {kind === "dropper" && <Dropper id={id} {...vessel} mark={mark} />}
        {kind === "pump" && <Pump id={id} {...vessel} mark={mark} />}
        {kind === "jar" && <Jar id={id} {...vessel} mark={mark} />}
        {kind === "tube" && <Tube id={id} {...vessel} mark={mark} />}
        {kind === "stick" && <Stick id={id} {...vessel} mark={mark} />}
        {kind === "flask" && <Flask id={id} {...vessel} mark={mark} />}
        {kind === "duo" && <Duo id={id} {...vessel} mark={mark} />}
        {kind === "sachet" && <Tube id={id} {...vessel} mark={mark} />}
      </g>
    </svg>
  );
}

type PartProps = VesselData & { id: string; mark?: string };

function LabelBlock({
  x,
  y,
  w,
  h,
  paper,
  ink,
  mark,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  paper: string;
  ink: string;
  mark?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={paper} opacity="0.94" rx="1" />
      {/* engraved rules standing in for set type at small sizes */}
      <rect x={x + 7} y={y + 9} width={w - 14} height="1.4" fill={ink} opacity="0.75" />
      {mark ? (
        <text
          x={x + w / 2}
          y={y + h / 2 + 4}
          textAnchor="middle"
          fontSize="11"
          letterSpacing="2.4"
          fill={ink}
          opacity="0.9"
          fontFamily="Georgia, serif"
        >
          {mark}
        </text>
      ) : null}
      <rect
        x={x + 7}
        y={y + h - 11}
        width={(w - 14) * 0.45}
        height="1.1"
        fill={ink}
        opacity="0.45"
      />
    </g>
  );
}

function Dropper({ id, glass, cap, label, mark }: PartProps) {
  return (
    <>
      <Shadow id={id} width={58} />
      {/* pipette collar */}
      <rect x="86" y="46" width="28" height="10" rx="2" fill={cap} />
      <rect x="84" y="56" width="32" height="26" rx="3" fill={cap} />
      <rect x="88" y="60" width="6" height="18" rx="3" fill="#ffffff" opacity="0.18" />
      {/* neck */}
      <rect x="88" y="82" width="24" height="12" fill={glass} opacity="0.9" />
      {/* body */}
      <path
        d="M71 94 h58 a10 10 0 0 1 10 10 v166 a12 12 0 0 1 -12 12 h-54 a12 12 0 0 1 -12 -12 v-166 a10 10 0 0 1 10 -10 z"
        fill={`url(#${id}-glass)`}
      />
      <path
        d="M76 100 h9 v168 h-9 z"
        fill={`url(#${id}-spec)`}
        opacity="0.75"
      />
      <LabelBlock x={72} y={150} w={56} h={74} paper={label} ink="#0e1d24" mark={mark} />
    </>
  );
}

function Pump({ id, glass, cap, label, mark }: PartProps) {
  return (
    <>
      <Shadow id={id} width={62} />
      {/* actuator */}
      <path d="M92 26 h22 a4 4 0 0 1 4 4 v8 h-30 v-8 a4 4 0 0 1 4 -4 z" fill={cap} />
      <rect x="96" y="38" width="12" height="14" fill={cap} opacity="0.85" />
      <rect x="84" y="52" width="32" height="14" rx="2" fill={cap} />
      <rect x="88" y="66" width="24" height="10" fill={glass} opacity="0.85" />
      <path
        d="M66 76 h68 a12 12 0 0 1 12 12 v172 a14 14 0 0 1 -14 14 h-64 a14 14 0 0 1 -14 -14 v-172 a12 12 0 0 1 12 -12 z"
        fill={`url(#${id}-glass)`}
      />
      <path d="M72 84 h10 v176 h-10 z" fill={`url(#${id}-spec)`} opacity="0.7" />
      <LabelBlock x={68} y={142} w={64} h={82} paper={label} ink="#0e1d24" mark={mark} />
    </>
  );
}

function Jar({ id, fill, cap, label, mark }: PartProps) {
  return (
    <>
      <Shadow id={id} width={76} />
      {/* lid */}
      <rect x="52" y="108" width="96" height="34" rx="6" fill={cap} />
      <rect x="52" y="108" width="96" height="9" rx="4" fill="#ffffff" opacity="0.16" />
      {/* knurling */}
      {Array.from({ length: 11 }).map((_, i) => (
        <rect
          key={i}
          x={58 + i * 8.4}
          y="122"
          width="1.6"
          height="14"
          fill="#0e1d24"
          opacity="0.16"
        />
      ))}
      {/* body */}
      <path
        d="M56 142 h88 v112 a14 14 0 0 1 -14 14 h-60 a14 14 0 0 1 -14 -14 z"
        fill={`url(#${id}-glass)`}
      />
      {/* contents seen through the glass at the shoulder */}
      <rect x="62" y="148" width="76" height="14" rx="4" fill={fill} opacity="0.5" />
      <path d="M62 148 h10 v118 h-10 z" fill={`url(#${id}-spec)`} opacity="0.7" />
      <LabelBlock x={60} y={178} w={80} h={62} paper={label} ink="#0e1d24" mark={mark} />
    </>
  );
}

function Tube({ id, glass, cap, label, mark }: PartProps) {
  return (
    <>
      <Shadow id={id} width={54} />
      <rect x="82" y="34" width="36" height="20" rx="3" fill={cap} />
      <rect x="86" y="38" width="6" height="12" rx="3" fill="#ffffff" opacity="0.2" />
      <rect x="88" y="54" width="24" height="8" fill={cap} opacity="0.7" />
      {/* tube body: rounded shoulders, crimped flat base */}
      <path
        d="M74 62 q26 -6 52 0 v190 q-26 8 -52 0 z"
        fill={`url(#${id}-glass)`}
      />
      <path d="M79 70 h8 v180 h-8 z" fill={`url(#${id}-spec)`} opacity="0.68" />
      {/* crimp seam */}
      <rect x="72" y="252" width="56" height="16" rx="2" fill={glass} opacity="0.9" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect
          key={i}
          x={76 + i * 7.6}
          y="255"
          width="1.5"
          height="10"
          fill="#0e1d24"
          opacity="0.18"
        />
      ))}
      <LabelBlock x={76} y={136} w={48} h={76} paper={label} ink="#0e1d24" mark={mark} />
    </>
  );
}

function Stick({ id, cap, label, mark }: PartProps) {
  return (
    <>
      <Shadow id={id} width={38} />
      <rect x="84" y="96" width="32" height="42" rx="4" fill={cap} />
      <rect x="88" y="100" width="5" height="32" rx="2.5" fill="#ffffff" opacity="0.2" />
      <rect x="86" y="138" width="28" height="8" fill={cap} opacity="0.6" />
      <path
        d="M82 146 h36 v118 a8 8 0 0 1 -8 8 h-20 a8 8 0 0 1 -8 -8 z"
        fill={`url(#${id}-glass)`}
      />
      <path d="M86 152 h6 v112 h-6 z" fill={`url(#${id}-spec)`} opacity="0.7" />
      <LabelBlock x={84} y={180} w={32} h={56} paper={label} ink="#0e1d24" mark={mark} />
    </>
  );
}

function Flask({ id, glass, cap, label, mark }: PartProps) {
  return (
    <>
      <Shadow id={id} width={64} />
      <rect x="84" y="40" width="32" height="18" rx="3" fill={cap} />
      <rect x="88" y="58" width="24" height="10" fill={glass} opacity="0.9" />
      {/* faceted apothecary shoulder */}
      <path
        d="M100 68 l38 22 v168 a12 12 0 0 1 -12 12 h-52 a12 12 0 0 1 -12 -12 v-168 z"
        fill={`url(#${id}-glass)`}
      />
      {/* the clear window that shows oxidation state */}
      <rect x="86" y="104" width="28" height="44" rx="3" fill="#ffffff" opacity="0.22" />
      <rect x="86" y="104" width="28" height="44" rx="3" fill="none" stroke={label} strokeWidth="1" opacity="0.5" />
      <path d="M70 96 h9 v164 h-9 z" fill={`url(#${id}-spec)`} opacity="0.7" />
      <LabelBlock x={68} y={164} w={64} h={66} paper={label} ink="#0e1d24" mark={mark} />
    </>
  );
}

function Duo({ id, glass, cap, label, mark }: PartProps) {
  return (
    <>
      <Shadow id={id} width={84} />
      {/* rear bottle, offset and dimmed for depth */}
      <g opacity="0.55">
        <rect x="118" y="84" width="26" height="14" rx="2" fill={cap} />
        <path
          d="M112 98 h38 a9 9 0 0 1 9 9 v152 a11 11 0 0 1 -11 11 h-34 a11 11 0 0 1 -11 -11 v-152 a9 9 0 0 1 9 -9 z"
          fill={`url(#${id}-glass)`}
        />
      </g>
      {/* front bottle */}
      <rect x="52" y="70" width="30" height="16" rx="2" fill={cap} />
      <path
        d="M44 86 h46 a10 10 0 0 1 10 10 v164 a12 12 0 0 1 -12 12 h-42 a12 12 0 0 1 -12 -12 v-164 a10 10 0 0 1 10 -10 z"
        fill={`url(#${id}-glass)`}
      />
      <path d="M50 94 h8 v166 h-8 z" fill={`url(#${id}-spec)`} opacity="0.7" />
      <LabelBlock x={46} y={150} w={46} h={70} paper={label} ink="#0e1d24" mark={mark} />
      {/* a low jar in front, completing the set silhouette */}
      <rect x="96" y="220" width="60" height="12" rx="4" fill={cap} />
      <path d="M99 232 h54 v24 a10 10 0 0 1 -10 10 h-34 a10 10 0 0 1 -10 -10 z" fill={glass} opacity="0.85" />
      <rect x="104" y="238" width="44" height="18" rx="2" fill={label} opacity="0.9" />
    </>
  );
}
