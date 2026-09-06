import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { Box3, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import {
  animateBoop,
  BOOP_SCALE,
  legPose,
} from '../src/components/tiny-planet/boop.ts'

const bytes = await readFile(
  new URL('../public/models/boop.glb', import.meta.url),
)
const { scene: robot } = await new GLTFLoader().parseAsync(
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  '',
)
robot.scale.setScalar(BOOP_SCALE)

test('Blender joints keep planted shoes on the floor throughout a complete stride', () => {
  const body = robot.getObjectByName('body')
  for (let frame = 0; frame <= 100; frame++) {
    const phase = frame / 100
    body.position.y = -0.14
    for (const [index, side] of ['left', 'right'].entries()) {
      const pose = legPose(phase + index * 0.5, 1)
      robot.getObjectByName(`hip_${side}`).rotation.x = pose.hip
      robot.getObjectByName(`knee_${side}`).rotation.x = pose.knee
      robot.getObjectByName(`ankle_${side}`).rotation.x = pose.ankle
      robot.updateMatrixWorld(true)
      const shoe = robot.getObjectByName(`Sneaker_${side}`)
      assert.ok(shoe, `Missing sneaker ${side}`)
      const bounds = new Box3().setFromObject(shoe)
      assert.ok(
        Math.abs(bounds.min.y - pose.lift * BOOP_SCALE) < 0.002,
        `Foot ${side} at phase ${phase}: ${bounds.min.y}, expected ${pose.lift * BOOP_SCALE}`,
      )
    }
  }
})

test('actual movement alternates legs, blocked movement settles, and jumping tucks knees', () => {
  const update = animateBoop(robot)
  let state
  for (let i = 0; i < 40; i++) state = update(3.2 / 45, true, 1 / 45)
  assert.ok(state.blend > 0.99)
  assert.notEqual(
    robot.getObjectByName('hip_left').rotation.x,
    robot.getObjectByName('hip_right').rotation.x,
  )
  const phase = state.phase
  for (let i = 0; i < 90; i++) state = update(0, true, 1 / 45)
  assert.equal(
    state.phase,
    phase,
    'Standing or pushing into a wall must not advance the stride',
  )
  assert.ok(state.blend < 0.0001)
  assert.ok(Math.abs(robot.getObjectByName('hip_left').rotation.x) < 0.001)
  update(0.1, false, 1 / 45)
  assert.equal(robot.getObjectByName('knee_left').rotation.x, 0.95)
  assert.equal(robot.getObjectByName('shoulder_left').rotation.x, -1.1)
  assert.equal(robot.getObjectByName('body').position.y, 0)
})

test('stance travels backward by the same distance the character moves forward', () => {
  const side = 'left',
    body = robot.getObjectByName('body'),
    foot = robot.getObjectByName('ankle_left')
  body.position.y = -0.14
  const positions = [0.05, 0.25, 0.45].map((phase) => {
    const pose = legPose(phase, 1)
    robot.getObjectByName(`hip_${side}`).rotation.x = pose.hip
    robot.getObjectByName(`knee_${side}`).rotation.x = pose.knee
    robot.getObjectByName(`ankle_${side}`).rotation.x = pose.ankle
    robot.updateMatrixWorld(true)
    return (
      foot.getWorldPosition(new Vector3()).z + phase * 0.84 * 2 * BOOP_SCALE
    )
  })
  assert.ok(Math.max(...positions) - Math.min(...positions) < 0.00001)
})
