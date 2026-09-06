import * as THREE from 'three'

function canvasTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.flipY = false // Blender/glTF UVs use the opposite image origin to Three primitives.
  texture.anisotropy = 4
  return texture
}

function surface(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width; canvas.height = height
  const context = canvas.getContext('2d')!
  context.fillStyle = '#080f14'; context.fillRect(0, 0, width, height)
  return { canvas, context }
}

export function nameplate(text: string) {
  const { canvas, context } = surface(1024, 128)
  context.fillStyle = '#ffb56c'; context.font = '500 54px monospace'
  context.textAlign = 'center'; context.textBaseline = 'middle'
  context.fillText(text, 512, 64, 970)
  return canvasTexture(canvas)
}

export function informationScreen(kicker: string, heading: string, lines: string[], portrait = false) {
  const width = portrait ? 512 : 1024, height = portrait ? 1080 : 576
  const { canvas, context: ctx } = surface(width, height)
  const margin = portrait ? 34 : 58
  ctx.fillStyle = '#ffad6d'; ctx.fillRect(margin, 54, 35, 5)
  ctx.font = `${portrait ? 21 : 23}px monospace`; ctx.fillText(kicker.toUpperCase(), margin, 110, width-margin*2)
  ctx.fillStyle = '#f1f3ee'; ctx.font = `500 ${portrait ? 50 : 57}px sans-serif`
  const words = heading.split(' ')
  let line = '', y = portrait ? 220 : 210
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (line && ctx.measureText(next).width > width-margin*2) {
      ctx.fillText(line, margin, y); y += 65; line = word
    } else line = next
  }
  ctx.fillText(line, margin, y, width-margin*2)
  y += portrait ? 100 : 75
  ctx.font = `${portrait ? 27 : 30}px monospace`
  lines.forEach((text, index) => {
    ctx.fillStyle = index === 0 ? '#ffb56c' : '#a9bdc6'
    ctx.fillText(text, margin, y+index*52, width-margin*2)
  })
  ctx.strokeStyle = '#28404a'; ctx.lineWidth = 2; ctx.beginPath()
  ctx.moveTo(margin, height-54); ctx.lineTo(width-margin, height-54); ctx.stroke()
  return canvasTexture(canvas)
}

export function projectScreen(image: HTMLImageElement) {
  const { canvas, context } = surface(1536, 864)
  const scale = Math.min(canvas.width/image.width, canvas.height/image.height)
  const width = image.width*scale, height = image.height*scale
  context.drawImage(image, (canvas.width-width)/2, (canvas.height-height)/2, width, height)
  return canvasTexture(canvas)
}
