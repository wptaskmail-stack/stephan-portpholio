import { getPayload } from 'payload'
import config from '@payload-config'

// The local API talks straight to the database from server components —
// no HTTP round-trip, no separate API to host.
export async function getPayloadClient() {
  return getPayload({ config })
}

export async function getNavigation() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation', depth: 1 })
}

export async function getSiteSettings() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}

export async function getPageBySlug(slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: slug } }, { published: { equals: true } }],
    },
    depth: 3,
    limit: 1,
  })
  return res.docs[0] || null
}

export async function getHomePage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const homeId =
    typeof settings.homePage === 'object'
      ? (settings.homePage as any)?.id
      : settings.homePage
  if (!homeId) return null
  try {
    return await payload.findByID({ collection: 'pages', id: homeId, depth: 3 })
  } catch {
    return null
  }
}
