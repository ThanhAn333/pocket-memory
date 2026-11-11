export type Photo = {
  src: string
  alt: string
  caption: string
  position?: string
}

export const invitation = {
  graduateName: '',
  university: '',
  degree: '',
  graduationYear: '',
  dateTimeISO: '',
  endDateTimeISO: '',
  timeZone: 'Asia/Ho_Chi_Minh',
  venue: '',
  address: '',
  mapUrl: '',
  rsvpUrl: '',
  photos: [
    { src: '', alt: '', caption: 'The beginning of everything.' },
    { src: '', alt: '', caption: 'Days worth remembering.' },
    { src: '', alt: '', caption: 'Growing, together.' },
    { src: '', alt: '', caption: 'One beautiful chapter.' },
  ] as Photo[],
  portraitUrl: '',
  portraitAlt: '',
  musicUrl: '/hua-jgkid.m4a',
  invitationMessage: [
    'Thanh xuân là một hành trình thật đẹp.',
    'Cảm ơn vì đã trở thành một phần trong những năm tháng đáng nhớ của mình.',
    'Ngày tốt nghiệp sẽ càng ý nghĩa hơn khi có những người thân yêu ở bên cạnh.',
    'Mình rất mong được gặp bạn!',
  ],
  siteUrl: '',
  shareImageUrl: '/social-preview.png',
}
