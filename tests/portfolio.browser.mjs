// Run this function with playwright-cli against a local Vite development server.
export default async function (page) {
  const origin = 'http://127.0.0.1:4323'
  const check = (condition, message) => { if (!condition) throw new Error(message) }
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(origin)
  await page.waitForSelector('#planet[data-ready=true]')

  await page.locator('#journey').fill('0.5')
  await page.waitForTimeout(2000)
  const station = await page.locator('#story').evaluate(element => ({
    inert: element.inert, opacity: getComputedStyle(element).opacity,
    title: element.querySelector('h1').textContent,
  }))
  check(!station.inert && station.opacity === '1', 'A partial scroll stranded the content')
  check(station.title === 'Netflix Clone', 'Partial scroll settled at the wrong station')
  await page.locator('#stops button').first().click()
  await page.waitForTimeout(1600)
  // Sample immediately after a hash change, before the camera can reach Contact.
  const earlyTitle = await page.evaluate(async () => {
    location.hash = 'contact'
    await new Promise(resolve => setTimeout(resolve, 10))
    return document.querySelector('#story h1').textContent
  })
  check(earlyTitle !== 'Let’s build something.', 'History committed destination text before camera travel')
  await page.waitForTimeout(2000)
  check(await page.locator('#planet').getAttribute('data-active-stop') === 'contact', 'Hash navigation missed Contact')

  // Delay the lazy world module to open a dialog before the controller exists.
  let release
  const gate = new Promise(resolve => { release = resolve })
  await page.route('**/tiny-planet/world.ts*', async route => { await gate; await route.continue() })
  await page.goto(origin, { waitUntil: 'domcontentloaded' })
  await page.locator('#inspect').click()
  release()
  await page.waitForSelector('#planet[data-ready=true]')
  await page.waitForTimeout(300)
  const first = await page.locator('#world').screenshot()
  await page.waitForTimeout(300)
  const second = await page.locator('#world').screenshot()
  check(first.equals(second), 'A dialog opened before world creation failed to pause rendering')
  await page.unroute('**/tiny-planet/world.ts*')
  await page.locator('#close-details').click()

  await page.locator('#play').click()
  await page.waitForTimeout(400)
  await page.keyboard.down('d')
  await page.waitForTimeout(250)
  const walking = JSON.parse(await page.locator('#world').getAttribute('data-gait'))
  await page.keyboard.up('d')
  check(walking.blend > .9 && walking.grounded, 'Walking did not articulate Boop')
  await page.waitForTimeout(800)
  const standing = JSON.parse(await page.locator('#world').getAttribute('data-gait'))
  check(standing.blend < .001, 'Boop kept stepping while stationary')
  await page.keyboard.press('Space')
  await page.waitForTimeout(200)
  const airborne = JSON.parse(await page.locator('#world').getAttribute('data-gait'))
  check(!airborne.grounded, 'Jump did not leave the ground')
  await page.waitForTimeout(1000)
  await page.locator('#return').click()

  await page.locator('#motion').click()
  for (let i = 0; i < 6; i++) {
    await page.locator('#stops button').nth(i).click()
    await page.waitForTimeout(100)
    await page.locator('#inspect').click()
    check((await page.locator('dialog').innerText()).length > 80, `Station ${i} lost its details`)
    await page.locator('#close-details').click()
  }
  await page.setViewportSize({ width: 390, height: 844 })
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile horizontal overflow')
  check(errors.length === 0, errors.join('\n'))
  return { partialScroll: 'pass', history: 'pass', loadingDialog: 'pass', gait: 'pass', stations: 6, mobile: 'pass' }
}
