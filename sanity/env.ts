export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-12'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skJTF2bLsRLAa6TsDV5w4xmWzxBr5DKGYPRR9mbEHvOIDUVmIjDxRK319Pt94Qtxn5P8LO3PrMlW8ZIlPtL9zZy1T6takg1SVZ9ubwA9BHwF4qvtwSRLBh3lMV5sPmehnaWDbtiUBg2fRRLMBO4ewjfHT6dU1OKDUe7p8TpkQRaNbGoRI3u3",
  'Missing environment variable: "skJTF2bLsRLAa6TsDV5w4xmWzxBr5DKGYPRR9mbEHvOIDUVmIjDxRK319Pt94Qtxn5P8LO3PrMlW8ZIlPtL9zZy1T6takg1SVZ9ubwA9BHwF4qvtwSRLBh3lMV5sPmehnaWDbtiUBg2fRRLMBO4ewjfHT6dU1OKDUe7p8TpkQRaNbGoRI3u3"'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
