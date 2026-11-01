import { Float, Html } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import { DoubleSide, Group, MathUtils } from 'three'

import { cn } from '@/lib/utils'

export interface TechOrbitSceneProps {
  labels: readonly string[]
  /** 'high' → dpr [1, 1.5] + antialias; 'low' → dpr 1, no antialias. */
  quality: 'high' | 'low'
  /** Show the floating HTML labels (desktop/tablet only — DESIGN.md §11). */
  showLabels: boolean
  /** Scroll progress 0 → 1, written by ScrollTrigger, read per frame. */
  progress: { current: number }
  /** Whether the canvas is on screen; drives `frameloop`. */
  active: boolean
  className?: string
}

type ShapeKind = 'torus' | 'octahedron' | 'box' | 'sphere' | 'ring' | 'capsule' | 'tetra' | 'icosa'

interface Body {
  kind: ShapeKind
  color: string
  radius: number
  tilt: number
  phase: number
  size: number
}

const SHAPES: ShapeKind[] = ['torus', 'octahedron', 'box', 'sphere', 'ring', 'capsule', 'tetra', 'icosa']
const PALETTE = ['#2A4BD7', '#8FB4FF', '#FFFFFF', '#1B35A8', '#BCD4FF', '#0B0C10', '#4C6FFF', '#E3EDFF']

function buildBodies(count: number): Body[] {
  return Array.from({ length: count }, (_, index) => {
    const track = index % 2
    return {
      kind: SHAPES[index % SHAPES.length],
      color: PALETTE[index % PALETTE.length],
      radius: track === 0 ? 2.35 : 3.05,
      tilt: track === 0 ? 0.34 : -0.3,
      phase: (index / count) * Math.PI * 2,
      size: track === 0 ? 0.26 : 0.22,
    }
  })
}

function BodyGeometry({ kind, size, color }: { kind: ShapeKind; size: number; color: string }) {
  const material = (
    <meshStandardMaterial color={color} roughness={0.32} metalness={0.12} envMapIntensity={0.4} />
  )

  switch (kind) {
    case 'torus':
      return (
        <mesh>
          <torusGeometry args={[size, size * 0.38, 16, 32]} />
          {material}
        </mesh>
      )
    case 'octahedron':
      return (
        <mesh>
          <octahedronGeometry args={[size * 1.25, 0]} />
          {material}
        </mesh>
      )
    case 'box':
      return (
        <mesh>
          <boxGeometry args={[size * 1.7, size * 1.7, size * 1.7]} />
          {material}
        </mesh>
      )
    case 'ring':
      return (
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <ringGeometry args={[size * 0.9, size * 1.35, 32]} />
          <meshStandardMaterial
            color={color}
            roughness={0.4}
            metalness={0.1}
            side={DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>
      )
    case 'capsule':
      return (
        <mesh rotation={[0, 0, Math.PI / 3]}>
          <capsuleGeometry args={[size * 0.55, size * 1.1, 6, 14]} />
          {material}
        </mesh>
      )
    case 'tetra':
      return (
        <mesh>
          <tetrahedronGeometry args={[size * 1.35, 0]} />
          {material}
        </mesh>
      )
    case 'icosa':
      return (
        <mesh>
          <icosahedronGeometry args={[size * 1.15, 0]} />
          {material}
        </mesh>
      )
    case 'sphere':
    default:
      return (
        <mesh>
          <sphereGeometry args={[size, 24, 24]} />
          {material}
        </mesh>
      )
  }
}

function OrbitBody({
  body,
  label,
  showLabels,
  interactive,
}: {
  body: Body
  label: string
  showLabels: boolean
  interactive: boolean
}) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const target = useRef(1)

  useFrame(() => {
    const group = groupRef.current
    if (!group) return
    const next = MathUtils.lerp(group.scale.x, target.current, 0.12)
    group.scale.setScalar(next)
  })

  return (
    <group rotation={[body.tilt, 0, body.phase]}>
      <group ref={groupRef} position={[body.radius, 0, 0]}>
        <group
          onPointerOver={
            interactive
              ? (event) => {
                  event.stopPropagation()
                  target.current = 1.15
                  setHovered(true)
                }
              : undefined
          }
          onPointerOut={
            interactive
              ? () => {
                  target.current = 1
                  setHovered(false)
                }
              : undefined
          }
        >
          <BodyGeometry kind={body.kind} size={body.size} color={body.color} />
        </group>
        {showLabels ? (
          <Html
            center
            distanceFactor={7}
            position={[0, body.size * 2.4, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <span
              className={cn(
                'whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] transition-colors',
                hovered
                  ? 'border-primary/40 bg-primary text-primary-foreground'
                  : 'border-border bg-card/80 text-muted-foreground',
              )}
            >
              {label}
            </span>
          </Html>
        ) : null}
      </group>
    </group>
  )
}

function OrbitSystem({
  labels,
  showLabels,
  progress,
  interactive,
}: {
  labels: readonly string[]
  showLabels: boolean
  progress: { current: number }
  interactive: boolean
}) {
  const parallaxRef = useRef<Group>(null)
  const spinRef = useRef<Group>(null)
  const bodies = useMemo(() => buildBodies(labels.length), [labels.length])

  useFrame((state, delta) => {
    const spin = spinRef.current
    if (spin) {
      spin.rotation.y += delta * 0.08
      spin.rotation.z = progress.current * 0.55
    }
    const parallax = parallaxRef.current
    if (parallax) {
      const max = interactive ? 0.2 : 0.06
      parallax.rotation.y = MathUtils.lerp(parallax.rotation.y, state.pointer.x * max, 0.06)
      parallax.rotation.x = MathUtils.lerp(parallax.rotation.x, -state.pointer.y * max, 0.06)
    }
  })

  return (
    <group ref={parallaxRef}>
      <group ref={spinRef}>
        <mesh>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshPhysicalMaterial
            color="#2A4BD7"
            metalness={0.1}
            roughness={0.15}
            emissive="#1B35A8"
            emissiveIntensity={0.35}
            clearcoat={0.6}
            clearcoatRoughness={0.3}
          />
        </mesh>

        {bodies.map((body, index) => (
          <Float
            key={`${body.kind}-${index}`}
            speed={1.2}
            rotationIntensity={0.35}
            floatIntensity={0.5}
          >
            <OrbitBody
              body={body}
              label={labels[index] ?? ''}
              showLabels={showLabels}
              interactive={interactive}
            />
          </Float>
        ))}
      </group>
    </group>
  )
}

/**
 * The R3F scene itself. Loaded lazily by `TechOrbit` so three/drei never enter
 * the initial bundle (AGENT.md §8).
 */
export function TechOrbitScene({
  labels,
  quality,
  showLabels,
  progress,
  active,
  className,
}: TechOrbitSceneProps) {
  return (
    <div className={cn('h-full w-full', className)} aria-hidden="true">
      <Canvas
        camera={{ fov: 35, position: [0, 0, 7], near: 0.1, far: 40 }}
        dpr={quality === 'high' ? [1, 1.5] : 1}
        frameloop={active ? 'always' : 'never'}
        gl={{
          alpha: true,
          antialias: quality === 'high',
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        style={{ background: 'transparent', pointerEvents: showLabels ? 'auto' : 'none' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.1} color="#ffffff" />
        <directionalLight position={[-4, -2, -3]} intensity={0.7} color="#8FB4FF" />
        <OrbitSystem
          labels={labels}
          showLabels={showLabels}
          progress={progress}
          interactive={showLabels}
        />
      </Canvas>
    </div>
  )
}
