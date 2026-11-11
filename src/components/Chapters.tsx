import { useEffect, useState } from 'react'
import { ArrowUpRight, CalendarDays, Camera, Flower2, GraduationCap, MapPin, RotateCcw, Share2 } from 'lucide-react'
import { invitation as event, type Photo } from '../config/invitation'
import { downloadCalendar, eventFormatter, makeCalendar, parseEventDate } from '../lib/calendar'
import { invitationLink, shareInvitation } from '../lib/share'

const graduate = event.graduateName || 'Tên người tốt nghiệp'
const university = event.university || 'Tên trường đại học'
const starts = parseEventDate(event.dateTimeISO)
const ends = parseEventDate(event.endDateTimeISO)
const location = [event.venue, event.address].filter(Boolean).join(', ')
const albumFrameStyles = ['lily', 'lantern', 'letter', 'heirloom'] as const

function ChapterLabel({ children }: { children: string }) {
  return <p className="chapter-label" lang="en"><span aria-hidden="true" />{children}<span aria-hidden="true" /></p>
}

function ChapterTransition() {
  return <div className="chapter-transition" aria-hidden="true"><span /></div>
}

function Picture({ src, alt, placeholder, position }: Pick<Photo, 'src' | 'alt' | 'position'> & { placeholder: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="picture-mount">
      <div className="picture">
        {src && !failed
          ? <img src={src} alt={alt || placeholder} loading="lazy" decoding="async" style={{ objectPosition: position }} data-photo={position ? undefined : ''} onError={() => setFailed(true)} />
          : <div className="picture-placeholder"><Camera size={25} strokeWidth={1.15} /><span>{placeholder}</span></div>}
      </div>
    </div>
  )
}

export function Graduate() {
  return (
    <section className="chapter graduate" id="graduate" aria-labelledby="graduate-title">
      <ChapterTransition />
      <div className="graduate-layout chapter-inner">
        <div className="graduate-copy">
          <ChapterLabel>02 / The Unfolding</ChapterLabel>
          <h2 id="graduate-title" tabIndex={-1} lang="en">A new chapter <em>begins.</em></h2>
          <p className="graduate-name">{graduate}</p>
          <p>{university}</p>
          <p className="class-year" lang="en">Class of {event.graduationYear || '—'}</p>
        </div>
        <figure className="portrait frame" data-reveal>
          <Picture src={event.portraitUrl} alt={event.portraitAlt || (event.graduateName ? `Chân dung tốt nghiệp của ${event.graduateName}` : '')} placeholder="Ảnh chân dung tốt nghiệp" />
          <figcaption><GraduationCap size={19} strokeWidth={1.25} /> <span lang="en">The Graduate</span></figcaption>
        </figure>
      </div>
    </section>
  )
}

export function Album() {
  return (
    <section className="chapter album" id="memories" aria-labelledby="album-title">
      <ChapterTransition />
      <div className="chapter-inner">
        <div className="chapter-heading">
          <ChapterLabel>03 / The Memory Album</ChapterLabel>
          <h2 id="album-title" lang="en">Little moments,<br /><em>big memories.</em></h2>
          <p>Có những hành trình không được đo bằng thời gian, mà bằng những kỷ niệm ta mang theo.</p>
        </div>
        <div className="album-grid">
          {event.photos.map((photo, index) => (
            <figure className={`frame album-frame album-frame--${albumFrameStyles[index % albumFrameStyles.length]}`} key={index} data-reveal>
              <Picture {...photo} placeholder={`Ảnh kỷ niệm ${index + 1}`} />
              <figcaption lang="en">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Countdown({ date }: { date: Date | null }) {
  const [now, setNow] = useState(Date.now)
  const target = date?.getTime()
  const expired = target !== undefined && now >= target

  useEffect(() => {
    if (target === undefined || expired) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [target, expired])

  if (target === undefined) return null
  if (expired) return <p className="countdown-note">Thời điểm bắt đầu buổi lễ đã qua.</p>

  const remaining = Math.ceil((target - now) / 1000)
  const parts = [
    [Math.floor(remaining / 86400), 'Ngày'],
    [Math.floor(remaining / 3600) % 24, 'Giờ'],
    [Math.floor(remaining / 60) % 60, 'Phút'],
    [remaining % 60, 'Giây'],
  ] as const

  return <dl className="countdown" aria-label="Đếm ngược đến lễ tốt nghiệp">
    {parts.map(([value, unit]) => <div key={unit}><dt>{unit}</dt><dd>{String(value).padStart(2, '0')}</dd></div>)}
  </dl>
}

export function Ceremony() {
  const dateLabel = starts && eventFormatter({ dateStyle: 'full' }, event.timeZone).format(starts)
  const timeLabel = starts && eventFormatter({ hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }, event.timeZone).format(starts)
  const calendarReady = starts && ends && ends > starts

  return (
    <section className="chapter ceremony" id="ceremony" aria-labelledby="ceremony-title">
      <ChapterTransition />
      <div className="invitation-card">
        <Flower2 className="card-flower" size={35} strokeWidth={1} />
        <ChapterLabel>04 / The Special Day</ChapterLabel>
        <h2 id="ceremony-title" lang="en">Save the <em>Date</em></h2>
        <p className="ceremony-subtitle" lang="en">Graduation Ceremony</p>
        <div className="graduate-details">
          <p className="graduate-name">{graduate}</p>
          <p>{university}</p>
          <p>{event.degree || 'Ngành học sẽ được cập nhật'}</p>
        </div>
        <p className="event-date">{starts ? <time dateTime={event.dateTimeISO}>{dateLabel}</time> : 'Ngày tổ chức sẽ được cập nhật'}</p>
        <dl className="event-details">
          <div><CalendarDays size={20} /><dt>Giờ bắt đầu</dt><dd>{timeLabel || 'Đang cập nhật'}</dd></div>
          <div><MapPin size={20} /><dt>Địa điểm</dt><dd>{event.venue || 'Đang cập nhật'}<br />{event.address || 'Địa chỉ sẽ được cập nhật'}</dd></div>
        </dl>
        <Countdown date={starts} />
        <div className="button-row">
          {event.mapUrl
            ? <a className="button secondary" href={event.mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={17} /> Google Maps <ArrowUpRight size={14} /></a>
            : <button className="button secondary" disabled><MapPin size={17} /> Bản đồ chưa có</button>}
          <button className="button secondary" disabled={!calendarReady} onClick={() => {
            if (calendarReady) downloadCalendar(makeCalendar(starts, ends, event.graduateName, location))
          }}><CalendarDays size={17} /> {calendarReady ? 'Thêm vào lịch' : 'Lịch chưa có'}</button>
        </div>
      </div>
    </section>
  )
}

export function Closing({ onReplay }: { onReplay: () => void }) {
  const [feedback, setFeedback] = useState('')
  const [manualUrl, setManualUrl] = useState('')

  async function share() {
    let url: string
    try {
      url = invitationLink(event.siteUrl)
    } catch {
      url = invitationLink('')
    }
    const result = await shareInvitation(url)
    setFeedback(result)
    setManualUrl(result.startsWith('Bạn có thể') ? url : '')
  }

  return (
    <section className="chapter closing" id="rsvp" aria-labelledby="closing-title">
      <ChapterTransition />
      <div className="chapter-inner">
        <Flower2 className="closing-flower" size={48} strokeWidth={0.85} />
        <ChapterLabel>05 / With Love</ChapterLabel>
        <h2 id="closing-title" lang="en">See you <em>there.</em></h2>
        <div className="closing-letter">{event.invitationMessage.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        <div className="button-row">
          {event.rsvpUrl
            ? <a className="button primary" href={event.rsvpUrl} target="_blank" rel="noopener noreferrer" aria-label="Mình sẽ đến (mở biểu mẫu bên ngoài)">Mình sẽ đến <ArrowUpRight size={17} /></a>
            : <button className="button primary" disabled>Mình sẽ đến</button>}
          <button className="button secondary" onClick={share}><Share2 size={17} /> Chia sẻ thư mời</button>
        </div>
        {!event.rsvpUrl && <p className="form-note">Biểu mẫu xác nhận sẽ được cập nhật.</p>}
        <div role="status" className="share-status">{feedback}</div>
        {manualUrl && <input className="share-url" aria-label="Đường dẫn thư mời" value={manualUrl} readOnly onFocus={(e) => e.currentTarget.select()} />}
        <button className="text-link replay" onClick={() => { setFeedback(''); setManualUrl(''); onReplay() }}><RotateCcw size={15} /> Xem lại từ đầu</button>
      </div>
    </section>
  )
}
