import { MathUtils, Object3D } from 'three'

export const BOOP_SCALE = 1.15
const LEG = 0.42
const STRIDE = 0.84

// Foot targets describe a planted stance followed by a lifted return step.
// Two-bone IK keeps the shoes level and on the floor without moving the whole robot upward.
export function legPose(phase: number, blend: number) {
  const t = ((phase % 1) + 1) % 1
  const z =
    (t < 0.5 ? 0.42 - STRIDE * t * 2 : -0.42 + STRIDE * (t - 0.5) * 2) * blend
  const lift = t < 0.5 ? 0 : Math.sin((t - 0.5) * Math.PI * 2) * 0.24 * blend
  const drop = 0.84 - 0.14 * blend - lift
  const distance = Math.min(LEG * 2, Math.hypot(drop, z))
  const bend = Math.acos(distance / (LEG * 2))
  const hip = -Math.atan2(z, drop) - bend
  const knee = bend * 2
  return { hip, knee, ankle: -hip - knee, lift }
}

export function animateBoop(robot: Object3D) {
  const joint = (name: string) => {
    const node = robot.getObjectByName(name)
    if (!node) throw new Error(`Boop is missing joint: ${name}`)
    return node
  }
  const body = joint('body')
  const legs = ['left', 'right'].map((side) => ({
    hip: joint(`hip_${side}`),
    knee: joint(`knee_${side}`),
    ankle: joint(`ankle_${side}`),
    arm: joint(`shoulder_${side}`),
  }))
  let phase = 0,
    blend = 0
  return (distance: number, grounded: boolean, dt: number) => {
    const walking = grounded && distance > 0.0001
    blend = MathUtils.damp(blend, walking ? 1 : 0, 18, dt)
    // Each stance covers half a cycle, exactly matching world-space travel.
    if (walking) phase += distance / (STRIDE * 2 * BOOP_SCALE)
    body.position.y = -0.14 * blend
    legs.forEach((leg, i) => {
      const pose = legPose(phase + i * 0.5, blend)
      leg.hip.rotation.x = grounded ? pose.hip : -0.45
      leg.knee.rotation.x = grounded ? pose.knee : 0.95
      leg.ankle.rotation.x = grounded ? pose.ankle : -0.5
      leg.arm.rotation.x = grounded
        ? Math.cos((phase + i * 0.5) * Math.PI * 2) * 0.55 * blend
        : -1.1
      leg.arm.rotation.z = grounded ? 0 : (i ? 1 : -1) * 0.3
    })
    if (!grounded) body.position.y = 0
    return { phase, blend, grounded }
  }
}
