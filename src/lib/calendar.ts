export function parseEventDate(value: string) {
  const match = /^(\d{4}-\d{2}-\d{2})T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(value)
  if (!match) return null
  const day = new Date(match[1])
  const date = new Date(value)
  if (!Number.isFinite(day.getTime()) || !Number.isFinite(date.getTime())) return null
  return day.toISOString().slice(0, 10) === match[1] ? date : null
}

export function eventFormatter(options: Intl.DateTimeFormatOptions, timeZone: string) {
  try {
    return new Intl.DateTimeFormat('vi-VN', { ...options, timeZone })
  } catch {
    return new Intl.DateTimeFormat('vi-VN', { ...options, timeZone: 'UTC', timeZoneName: 'short' })
  }
}

const utc = (date: Date) => date.toISOString().replace(/[-:]|\.\d{3}/g, '')
const escapeText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/([;,])/g, '\\$1')

function foldLine(line: string) {
  const encoder = new TextEncoder()
  let result = ''
  let bytes = 0
  for (const character of line) {
    const size = encoder.encode(character).length
    if (bytes + size > 75) {
      result += '\r\n '
      bytes = 1
    }
    result += character
    bytes += size
  }
  return result
}

export function makeCalendar(start: Date, end: Date, name: string, location: string, now = new Date()) {
  if (end <= start) throw new RangeError('Calendar end must follow start')
  const summary = name ? `Lễ tốt nghiệp – ${name}` : 'Lễ tốt nghiệp'
  const eventKey = encodeURIComponent(summary).replaceAll('%', '').slice(0, 64)
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pocket Memories//Graduation Invitation//VI',
    'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${utc(start)}-${eventKey}@pocket-memories`,
    `DTSTAMP:${utc(now)}`, `DTSTART:${utc(start)}`, `DTEND:${utc(end)}`,
    `SUMMARY:${escapeText(summary)}`, `LOCATION:${escapeText(location)}`,
    'END:VEVENT', 'END:VCALENDAR', '',
  ].map(foldLine).join('\r\n')
}

export function downloadCalendar(content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'pocket-memories.ics'
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
