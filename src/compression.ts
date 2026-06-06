import pako from 'pako'

/**
 * Encode string -> base64url compressed (DEFLATE)
 */
export function compressToUrl(input: string): string {
  const compressed = pako.deflate(input)

  let binary = ''
  const len = compressed.length
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(compressed[i])
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

/**
 * Decode base64url -> string decompressed
 */
export function decompressFromUrl(input: string): string | null {
  try {
    const base64 = input
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    return pako.inflate(bytes, { to: 'string' })
  } catch {
    return null
  }
}