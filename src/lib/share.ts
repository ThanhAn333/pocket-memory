export function invitationLink(siteUrl: string) {
  const url = new URL(siteUrl || window.location.pathname, window.location.origin)
  url.hash = ''
  url.searchParams.delete('to')
  return url.href
}

export async function shareInvitation(url: string) {
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Pocket Memories', text: 'Một lời mời tốt nghiệp dành cho bạn.', url })
      return ''
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return ''
    }
  }
  try {
    await navigator.clipboard.writeText(url)
    return 'Đã sao chép đường dẫn.'
  } catch {
    return 'Bạn có thể sao chép đường dẫn bên dưới.'
  }
}
